import { defineConfig } from 'drizzle-kit';

import { loadEnvFiles } from './src/lib/env';

loadEnvFiles();

const provider = process.env.DATABASE_PROVIDER || 'sqlite';

const dialectMap: Record<string, 'sqlite' | 'postgresql' | 'mysql' | 'turso'> =
  {
    sqlite: 'sqlite',
    postgres: 'postgresql',
    postgresql: 'postgresql',
    mysql: 'mysql',
    turso: 'turso',
  };

const dialect = dialectMap[provider] || 'sqlite';

// Turso is a remote libsql database: it needs an auth token in addition to the
// libsql:// URL. Other dialects (sqlite/postgres/mysql) use the URL alone.
const dbCredentials =
  dialect === 'turso'
    ? {
        url: process.env.DATABASE_URL || 'file:data/local.db',
        authToken: process.env.DATABASE_AUTH_TOKEN,
      }
    : {
        url: process.env.DATABASE_URL || 'file:data/local.db',
      };

export default defineConfig({
  schema: './src/config/db/schema.ts',
  out: './drizzle',
  dialect,
  dbCredentials,
});
