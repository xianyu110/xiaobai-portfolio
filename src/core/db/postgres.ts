import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { DbConfig } from './types';

// workerd sets navigator.userAgent — the documented Workers runtime detection.
const isCloudflareWorker =
  (typeof navigator !== 'undefined' &&
    navigator.userAgent === 'Cloudflare-Workers') ||
  (typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis);

// Global database connection instance (singleton pattern)
let dbInstance: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function createPostgresDb(config: DbConfig) {
  let databaseUrl = config.database_url;

  const schemaName = (config.db_schema || 'public').trim();
  const connectionSchemaOptions =
    schemaName && schemaName !== 'public'
      ? { connection: { options: `-c search_path=${schemaName}` } }
      : {};

  if (isCloudflareWorker) {
    // Prefer the Hyperdrive binding — direct Workers→Postgres pays a full
    // TCP+TLS+auth handshake per connection; Hyperdrive pools at the edge.
    // The binding env is stashed on globalThis by src/server.ts (same pattern
    // as the D1 binding in d1.ts). Configure via wrangler.jsonc:
    //   "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "..." }]
    const g = globalThis as any;
    const env = g.__CF_ENV__ ?? g.__env__;
    const hyperdrive = env?.HYPERDRIVE as
      | { connectionString: string }
      | undefined;
    if (hyperdrive?.connectionString) {
      databaseUrl = hyperdrive.connectionString;
    }
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    const client = postgres(databaseUrl, {
      prepare: false,
      max: 1,
      idle_timeout: 10,
      connect_timeout: 5,
      ...connectionSchemaOptions,
    });

    return drizzle(client);
  }

  // Singleton mode: reuse existing connection
  if (config.db_singleton_enabled === 'true') {
    if (dbInstance) {
      return dbInstance;
    }

    client = postgres(databaseUrl, {
      prepare: false,
      max: Number(config.db_max_connections) || 1,
      idle_timeout: 30,
      connect_timeout: 10,
      ...connectionSchemaOptions,
    });

    dbInstance = drizzle({ client });
    return dbInstance;
  }

  // Non-singleton mode: create new connection each time
  const serverlessClient = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ...connectionSchemaOptions,
  });

  return drizzle({ client: serverlessClient });
}

export async function closePostgresDb(config: DbConfig) {
  if (config.db_singleton_enabled && client) {
    await client.end();
    client = null;
    dbInstance = null;
  }
}
