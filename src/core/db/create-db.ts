import { createD1Db } from './d1';
import { closeMysqlDb, createMysqlDb } from './mysql';
import { closePostgresDb, createPostgresDb } from './postgres';
import { createSqliteDb } from './sqlite';
import type { DbConfig } from './types';

const mysqlCompatProxyCache = new WeakMap<object, any>();
const sqliteCompatProxyCache = new WeakMap<object, any>();

/**
 * Global fallback for Drizzle `.returning()` on dialects that don't support it (notably MySQL).
 */
function withMysqlCompat<T extends object>(dbInstance: T): T {
  if (dbInstance && typeof dbInstance === 'object') {
    const cached = mysqlCompatProxyCache.get(dbInstance);
    if (cached) return cached as T;
  }

  const wrapQuery = (query: any, ctx: { payload?: any }) => {
    if (!query || typeof query !== 'object') return query;

    return new Proxy(query, {
      get(target, prop, receiver) {
        if (
          prop === 'onConflictDoUpdate' &&
          typeof (target as any).onConflictDoUpdate !== 'function' &&
          typeof (target as any).onDuplicateKeyUpdate === 'function'
        ) {
          return (cfg: any) => {
            const res = (target as any).onDuplicateKeyUpdate({
              set: cfg?.set,
            });
            return wrapQuery(res, ctx);
          };
        }

        if (
          prop === 'returning' &&
          typeof (target as any).returning !== 'function'
        ) {
          return async (..._args: any[]) => {
            await (target as any);
            if (ctx.payload === undefined) return [];
            return Array.isArray(ctx.payload) ? ctx.payload : [ctx.payload];
          };
        }

        const value = Reflect.get(target, prop, receiver);
        if (typeof value !== 'function') return value;

        return (...args: any[]) => {
          if (prop === 'values' || prop === 'set') {
            ctx.payload = args[0];
          }

          const res = value.apply(target, args);
          return wrapQuery(res, ctx);
        };
      },
    });
  };

  const proxied = new Proxy(dbInstance, {
    get(target, prop, receiver) {
      if (prop === 'transaction') {
        const original = Reflect.get(target, prop, receiver);
        if (typeof original !== 'function') return original;

        return (fn: any, ...rest: any[]) => {
          return original.call(
            target,
            (tx: any) => fn(withMysqlCompat(tx)),
            ...rest
          );
        };
      }

      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function') return value;

      if (prop !== 'insert' && prop !== 'update' && prop !== 'delete') {
        return value.bind(target);
      }

      return (...args: any[]) => {
        const res = value.apply(target, args);
        return wrapQuery(res, {});
      };
    },
  }) as any as T;

  if (dbInstance && typeof dbInstance === 'object') {
    mysqlCompatProxyCache.set(dbInstance, proxied);
  }

  return proxied;
}

/**
 * SQLite/Turso compatibility shim:
 * - `.for(...)` polyfilled as no-op
 * - D1 transaction workaround
 */
function withSqliteCompat<T extends object>(
  dbInstance: T,
  provider?: string
): T {
  if (dbInstance && typeof dbInstance === 'object') {
    const cached = sqliteCompatProxyCache.get(dbInstance);
    if (cached) return cached as T;
  }

  const wrapQuery = (query: any) => {
    if (!query || typeof query !== 'object') return query;

    return new Proxy(query, {
      get(target, prop, receiver) {
        if (prop === 'for' && typeof (target as any).for !== 'function') {
          return (..._args: any[]) => receiver;
        }

        const value = Reflect.get(target, prop, receiver);
        if (typeof value !== 'function') return value;

        return (...args: any[]) => {
          const res = value.apply(target, args);
          return wrapQuery(res);
        };
      },
    });
  };

  const proxied = new Proxy(dbInstance, {
    get(target, prop, receiver) {
      if (prop === 'transaction') {
        if (provider === 'd1') {
          return (fn: any) => fn(proxied);
        }
        const original = Reflect.get(target, prop, receiver);
        if (typeof original !== 'function') return original;
        return (fn: any, ...rest: any[]) =>
          original.call(
            target,
            (tx: any) => fn(withSqliteCompat(tx, provider)),
            ...rest
          );
      }

      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function') return value;

      if (typeof prop === 'string' && prop.startsWith('select')) {
        return (...args: any[]) => wrapQuery(value.apply(target, args));
      }

      return value.bind(target);
    },
  }) as any as T;

  if (dbInstance && typeof dbInstance === 'object') {
    sqliteCompatProxyCache.set(dbInstance, proxied);
  }

  return proxied;
}

/**
 * Universal DB accessor. Returns `any` to keep call sites stable across dialects.
 */
export function createDb(config: DbConfig): any {
  if (config.database_provider === 'none') {
    throw new Error(
      'Database access is disabled because DATABASE_PROVIDER=none.'
    );
  }

  if (config.database_provider === 'd1') {
    return withSqliteCompat(createD1Db() as any, 'd1');
  }

  if (['sqlite', 'turso'].includes(config.database_provider)) {
    return withSqliteCompat(
      createSqliteDb(config) as any,
      config.database_provider
    );
  }

  if (config.database_provider === 'mysql') {
    return withMysqlCompat(createMysqlDb(config) as any);
  }

  return createPostgresDb(config) as any;
}

export async function closeDb(config: DbConfig) {
  if (config.database_provider === 'postgresql') {
    await closePostgresDb(config);
    return;
  }

  if (config.database_provider === 'mysql') {
    await closeMysqlDb(config);
    return;
  }
}
