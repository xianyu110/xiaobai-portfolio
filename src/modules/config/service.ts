import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { envConfigs } from '@/config';
import { config } from '@/config/db/schema';
import { decryptSecret, encryptSecret, isEncryptedSecret } from '@/lib/crypto';

import { getSettings } from './settings';

export type ConfigMap = Record<string, string>;

// In-memory cache
let cachedConfigs: ConfigMap | null = null;
let cacheTime = 0;
const CACHE_TTL = 3600_000; // 1 hour

/**
 * Get all configs from database.
 */
export async function getDbConfigs(): Promise<ConfigMap> {
  const now = Date.now();
  if (cachedConfigs && now - cacheTime < CACHE_TTL) {
    return cachedConfigs;
  }

  try {
    if (!envConfigs.database_url && envConfigs.database_provider !== 'd1') {
      return {};
    }

    const rows = await db().select().from(config);
    const result: ConfigMap = {};
    for (const row of rows) {
      if (!row.name || row.value === null || row.value === undefined) continue;

      if (isEncryptedSecret(row.value)) {
        const plain = await decryptSecret(row.value);
        if (plain === null) {
          // Wrong/rotated encryption key — skip so env value (if any) applies.
          console.warn(`[config] failed to decrypt "${row.name}", skipping`);
          continue;
        }
        result[row.name] = plain;
      } else {
        result[row.name] = row.value;
      }
    }

    cachedConfigs = result;
    cacheTime = now;
    return result;
  } catch {
    return {};
  }
}

/**
 * Get all configs merged: env + database (database overrides env).
 */
export async function getAllConfigs(): Promise<ConfigMap> {
  const dbConfigs = await getDbConfigs();
  return { ...envConfigs, ...dbConfigs };
}

/**
 * Keys that must never be written through the admin UI / DB config layer.
 *
 * These are infrastructure-critical or session-signing secrets that should
 * only ever come from environment variables. Allowing a compromised admin
 * (or a confused-deputy bug) to overwrite them would let an attacker rotate
 * the session-signing key out from under us, swap the database connection,
 * etc.
 */
const PROTECTED_CONFIG_KEYS: ReadonlySet<string> = new Set([
  'auth_secret',
  'database_url',
  'database_auth_token',
  'database_provider',
  'db_schema',
  'db_singleton_enabled',
  'db_max_connections',
]);

/**
 * Keys whose values are secrets: encrypted at rest in the config table and
 * masked when returned to the admin UI.
 *
 * Derived from the settings definitions (password fields + private keys),
 * plus a name-pattern fallback so env-only secrets (e.g. stripe_secret_key)
 * and future custom keys are covered without registration.
 */
const SECRET_SETTING_NAMES: ReadonlySet<string> = new Set(
  getSettings()
    .filter((s) => s.type === 'password' || s.name.endsWith('_private_key'))
    .map((s) => s.name)
);

const SECRET_KEY_PATTERN =
  /(_secret|_secret_key|_token|_password|_private_key|_api_key|_access_key|_api_v3_key)$/;

export function isSecretConfigKey(name: string): boolean {
  return SECRET_SETTING_NAMES.has(name) || SECRET_KEY_PATTERN.test(name);
}

/** Mask marker — secrets never start with bullets, so it's unambiguous. */
const MASK_PREFIX = '••••••••';

/**
 * Mask a secret for display: keep the last 4 chars when long enough to be
 * unidentifiable from them, otherwise mask entirely.
 */
export function maskConfigValue(value: string): string {
  return value.length > 8 ? MASK_PREFIX + value.slice(-4) : MASK_PREFIX;
}

/** A masked value round-tripped from the admin UI means "unchanged". */
export function isMaskedConfigValue(value: string): boolean {
  return value.startsWith(MASK_PREFIX);
}

/**
 * Save multiple configs to database (upsert). Protected keys are silently
 * dropped — see PROTECTED_CONFIG_KEYS. Masked values round-tripped from the
 * admin UI are skipped (the user didn't change them). Secret keys are
 * encrypted at rest — see SECRET_SETTING_NAMES / SECRET_KEY_PATTERN.
 */
export async function saveConfigs(configs: ConfigMap) {
  const entries = await Promise.all(
    Object.entries(configs)
      .filter(
        ([name, value]) =>
          !PROTECTED_CONFIG_KEYS.has(name) && !isMaskedConfigValue(value)
      )
      .map(
        async ([name, value]): Promise<[string, string]> =>
          isSecretConfigKey(name)
            ? [name, await encryptSecret(value)]
            : [name, value]
      )
  );
  if (entries.length === 0) {
    return;
  }

  await db().transaction(async (tx: any) => {
    for (const [name, value] of entries) {
      const [existing] = await tx
        .select()
        .from(config)
        .where(eq(config.name, name))
        .limit(1);

      if (existing) {
        await tx.update(config).set({ value }).where(eq(config.name, name));
      } else {
        await tx.insert(config).values({ name, value });
      }
    }
  });

  // Invalidate cache
  cachedConfigs = null;
  cacheTime = 0;
}

/**
 * Get a single config value.
 */
export async function getConfig(name: string): Promise<string | undefined> {
  const configs = await getAllConfigs();
  return configs[name];
}

/**
 * Configs sanitized for the admin settings UI: protected keys removed,
 * secret values masked. Never send getAllConfigs() to a client — it
 * contains every env secret in plaintext.
 */
export async function getAdminConfigs(): Promise<ConfigMap> {
  const configs = await getAllConfigs();
  const result: ConfigMap = {};
  for (const [name, value] of Object.entries(configs)) {
    if (PROTECTED_CONFIG_KEYS.has(name)) continue;
    result[name] =
      isSecretConfigKey(name) && value ? maskConfigValue(value) : value;
  }
  return result;
}

// --- Custom configs -------------------------------------------------------

/** Valid custom config key: letters, digits, and `_ . : -`. */
const CUSTOM_KEY_PATTERN = /^[A-Za-z0-9_.:-]+$/;

/**
 * Keys that are "known" to the system — predefined settings plus every env
 * config key — and therefore not user-managed custom keys.
 */
function reservedConfigKeys(): Set<string> {
  return new Set<string>([
    ...getSettings().map((s) => s.name),
    ...Object.keys(envConfigs),
    ...PROTECTED_CONFIG_KEYS,
  ]);
}

export interface CustomConfig {
  key: string;
  value: string;
}

/**
 * Custom (user-defined) configs: DB-stored key/value pairs that aren't part
 * of any predefined setting or env key. Secret-like values are masked before
 * returning to the admin UI.
 */
export async function getCustomConfigs(): Promise<CustomConfig[]> {
  const reserved = reservedConfigKeys();
  const dbConfigs = await getDbConfigs();
  return Object.entries(dbConfigs)
    .filter(([name]) => !reserved.has(name))
    .map(([key, value]) => ({
      key,
      value: isSecretConfigKey(key) && value ? maskConfigValue(value) : value,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Replace the entire set of custom configs: upsert the provided pairs and
 * delete any previously-stored custom key that's no longer present. Reserved
 * keys are rejected so the custom tab can't shadow a predefined setting.
 */
export async function replaceCustomConfigs(
  pairs: CustomConfig[]
): Promise<void> {
  const reserved = reservedConfigKeys();
  const seen = new Set<string>();
  const clean: Array<[string, string]> = [];

  for (const pair of pairs) {
    const key = (pair?.key ?? '').trim();
    if (!key) continue; // skip blank rows
    if (reserved.has(key)) throw new Error(`Reserved key not allowed: ${key}`);
    if (!CUSTOM_KEY_PATTERN.test(key)) throw new Error(`Invalid key: ${key}`);
    if (seen.has(key)) throw new Error(`Duplicate key: ${key}`);
    seen.add(key);
    clean.push([key, pair.value ?? '']);
  }

  const dbConfigs = await getDbConfigs();
  const existingCustom = Object.keys(dbConfigs).filter((n) => !reserved.has(n));
  const keep = new Set(clean.map(([k]) => k));
  const toDelete = existingCustom.filter((k) => !keep.has(k));

  const entries = await Promise.all(
    clean
      .filter(([, value]) => !isMaskedConfigValue(value))
      .map(
        async ([name, value]): Promise<[string, string]> =>
          isSecretConfigKey(name)
            ? [name, await encryptSecret(value)]
            : [name, value]
      )
  );

  await db().transaction(async (tx: any) => {
    for (const name of toDelete) {
      await tx.delete(config).where(eq(config.name, name));
    }
    for (const [name, value] of entries) {
      const [existing] = await tx
        .select()
        .from(config)
        .where(eq(config.name, name))
        .limit(1);
      if (existing) {
        await tx.update(config).set({ value }).where(eq(config.name, name));
      } else {
        await tx.insert(config).values({ name, value });
      }
    }
  });

  // Invalidate cache
  cachedConfigs = null;
  cacheTime = 0;
}

/**
 * Filter configs to only include public-safe keys.
 */
export function filterPublicConfigs(
  configs: ConfigMap,
  publicKeys: string[]
): ConfigMap {
  const result: ConfigMap = {};
  for (const key of publicKeys) {
    if (PROTECTED_CONFIG_KEYS.has(key) || isSecretConfigKey(key)) continue;
    if (key in configs) {
      result[key] = configs[key];
    }
  }
  return result;
}
