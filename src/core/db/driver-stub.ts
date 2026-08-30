// Build-time stub for DB drivers that aren't needed at Workers runtime.
// vite.config.ts aliases the drivers NOT matching wrangler.jsonc's
// vars.DATABASE_PROVIDER here when building with a cloudflare NITRO_PRESET
// (d1 → stub mysql2 + postgres; postgresql → stub mysql2 and keep postgres.js
// for the Hyperdrive binding). The stubbed createXxxDb call paths are never
// reached at runtime, so the throw below should never fire in production.
//
// Importing the stub is harmless; calling it throws a clear error.
function unavailable(): never {
  throw new Error(
    'This DB driver was stubbed out of the Cloudflare Workers build because it ' +
      'does not match vars.DATABASE_PROVIDER in wrangler.jsonc. Make sure ' +
      'DATABASE_PROVIDER there matches the database you intend to use (d1, or ' +
      'postgresql with a Hyperdrive binding), then rebuild.'
  );
}

const stub: any = new Proxy(unavailable, {
  get: () => stub,
  apply: unavailable,
  construct: unavailable,
});

export default stub;
// Named exports drizzle-orm's drivers reference (mysql2's createPool).
export const createPool = stub;
export const createConnection = stub;
