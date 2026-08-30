import * as crypto from 'crypto';
import { and, count, eq, isNull, like, sql, type SQL } from 'drizzle-orm';

import { db } from '@/core/db';
import { apikey } from '@/config/db/schema';
import { decryptSecret, encryptSecret } from '@/lib/crypto';
import { getUuid } from '@/lib/hash';

const KEY_PREFIX = 'sk_';
const KEY_PREVIEW_LEN = 8; // chars of randomness shown in the prefix

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key, 'utf8').digest('hex');
}

function generateKey(): { key: string; keyHash: string; keyPrefix: string } {
  // 32 random bytes → ~43 chars base64url, plus the literal "sk_" prefix
  const rand = crypto.randomBytes(32).toString('base64url');
  const key = `${KEY_PREFIX}${rand}`;
  return {
    key,
    keyHash: hashKey(key),
    // Stored so the user can identify the key in the list UI without us
    // having to keep the plaintext around.
    keyPrefix: `${KEY_PREFIX}${rand.slice(0, KEY_PREVIEW_LEN)}`,
  };
}

/**
 * Create a new API key for a user. The `key` is also persisted (AES-encrypted
 * when CONFIG_ENCRYPTION_KEY is set, plaintext otherwise) so the user can copy
 * it again from the list UI; validation still goes through the indexed sha256
 * hash.
 */
export async function create(params: {
  userId: string;
  title: string;
}): Promise<{ id: string; key: string; title: string }> {
  const { userId, title } = params;
  const { key, keyHash, keyPrefix } = generateKey();

  const [row] = await db()
    .insert(apikey)
    .values({
      id: getUuid(),
      userId,
      keyHash,
      keyPrefix,
      key: await encryptSecret(key),
      title,
      status: 'active',
    })
    .returning();

  return { id: row.id, key, title: row.title };
}

/**
 * List active API keys for a user with pagination and optional search on
 * title, most recently used (falling back to created) first.
 */
export async function list(
  userId: string,
  page = 1,
  pageSize = 10,
  search?: string
) {
  const conditions: SQL[] = [
    eq(apikey.userId, userId),
    eq(apikey.status, 'active'),
    isNull(apikey.deletedAt) as unknown as SQL,
  ];
  if (search) {
    conditions.push(like(apikey.title, `%${search}%`));
  }
  const where = and(...conditions);

  const [totalResult] = await db()
    .select({ count: count() })
    .from(apikey)
    .where(where);

  const items = await db()
    .select({
      id: apikey.id,
      keyPrefix: apikey.keyPrefix,
      key: apikey.key,
      title: apikey.title,
      status: apikey.status,
      lastUsedAt: apikey.lastUsedAt,
      createdAt: apikey.createdAt,
    })
    .from(apikey)
    .where(where)
    .orderBy(sql`coalesce(${apikey.lastUsedAt}, ${apikey.createdAt}) desc`)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  // Decrypt stored keys for the copy action; undecryptable rows (rotated or
  // missing CONFIG_ENCRYPTION_KEY) return key=null and the UI hides copy.
  const decrypted = await Promise.all(
    items.map(async (item: (typeof items)[number]) => ({
      ...item,
      key: item.key ? await decryptSecret(item.key) : null,
    }))
  );

  return { items: decrypted, total: totalResult.count };
}

/**
 * Delete (soft) an API key.
 */
export async function remove(params: { userId: string; keyId: string }) {
  const { userId, keyId } = params;

  await db()
    .update(apikey)
    .set({ status: 'deleted', deletedAt: new Date() })
    .where(and(eq(apikey.id, keyId), eq(apikey.userId, userId)));
}

/**
 * Validate an API key. Returns the userId if valid, null otherwise.
 */
export async function validate(key: string): Promise<string | null> {
  if (!key) return null;
  const keyHash = hashKey(key);
  const [row] = await db()
    .select({ id: apikey.id, userId: apikey.userId })
    .from(apikey)
    .where(
      and(
        eq(apikey.keyHash, keyHash),
        eq(apikey.status, 'active'),
        isNull(apikey.deletedAt)
      )
    )
    .limit(1);

  if (!row) return null;

  // Best-effort usage tracking — a failed bump must not fail the request.
  db()
    .update(apikey)
    .set({ lastUsedAt: new Date() })
    .where(eq(apikey.id, row.id))
    .catch(() => {});

  return row.userId;
}
