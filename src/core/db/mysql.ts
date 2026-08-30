import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

import type { DbConfig } from './types';

const isCloudflareWorker =
  typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;

// Global database connection instance (singleton pattern)
let dbInstance: ReturnType<typeof drizzle> | null = null;
let pool: ReturnType<typeof mysql.createPool> | null = null;

export function createMysqlDb(config: DbConfig) {
  let databaseUrl = config.database_url;

  let isHyperdrive = false;

  if (isCloudflareWorker) {
    const { env }: { env: any } = { env: {} };
    isHyperdrive = 'HYPERDRIVE' in env;

    if (isHyperdrive) {
      const hyperdrive = env.HYPERDRIVE;
      databaseUrl = hyperdrive.connectionString;
    }
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    const client = mysql.createConnection({
      uri: databaseUrl,
      connectionLimit: 1,
      enableKeepAlive: true,
      waitForConnections: true,
    });

    return drizzle({ client });
  }

  // Singleton mode
  if (config.db_singleton_enabled === 'true') {
    if (dbInstance) {
      return dbInstance;
    }

    pool = mysql.createPool({
      uri: databaseUrl,
      connectionLimit: Number(config.db_max_connections) || 1,
      enableKeepAlive: true,
      waitForConnections: true,
    });

    dbInstance = drizzle({ client: pool });
    return dbInstance;
  }

  // Non-singleton mode
  const serverlessClient = mysql.createConnection({
    uri: databaseUrl,
    connectionLimit: 1,
    enableKeepAlive: true,
    waitForConnections: true,
  });

  return drizzle(serverlessClient);
}

export async function closeMysqlDb(config: DbConfig) {
  if (config.db_singleton_enabled && pool) {
    await pool.end();
    pool = null;
    dbInstance = null;
  }
}
