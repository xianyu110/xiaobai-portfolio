/**
 * Assign Role to User Script
 *
 * Usage:
 *   pnpm rbac:assign --email=user@example.com --role=admin
 *   pnpm rbac:assign --email=user@example.com --role=viewer --expires-days=30
 */

import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import * as schema from '../src/config/db/schema';

// ─── Create DB connection based on provider ─────────────────────────────────
async function createScriptDb() {
  const provider = process.env.DATABASE_PROVIDER || 'sqlite';
  const url = process.env.DATABASE_URL || 'file:data/local.db';

  if (provider === 'postgres' || provider === 'postgresql') {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = (await import('postgres')).default;
    const client = postgres(url, { prepare: false, max: 1, idle_timeout: 10 });
    return { db: drizzle({ client }) as any, close: () => client.end() };
  }

  if (provider === 'mysql') {
    const { drizzle } = await import('drizzle-orm/mysql2');
    const mysql = await import('mysql2/promise');
    const connection = await mysql.createConnection(url);
    return {
      db: drizzle({ client: connection }) as any,
      close: () => connection.end(),
    };
  }

  // Default: SQLite / Turso via libsql
  const { createClient } = await import('@libsql/client');
  const { drizzle } = await import('drizzle-orm/libsql');
  const client = createClient({ url });
  return { db: drizzle({ client }) as any, close: () => {} };
}

async function assignRole() {
  const args = process.argv.slice(2);
  const emailArg = args.find((arg) => arg.startsWith('--email='));
  const roleArg = args.find((arg) => arg.startsWith('--role='));
  const expiresDaysArg = args.find((arg) => arg.startsWith('--expires-days='));

  if (!emailArg || !roleArg) {
    console.error('Usage:');
    console.log('  pnpm rbac:assign --email=user@example.com --role=admin');
    console.log(
      '  pnpm rbac:assign --email=user@example.com --role=viewer --expires-days=30'
    );
    console.log('\nAvailable roles: super_admin, admin, editor, viewer');
    process.exit(1);
  }

  const email = emailArg.split('=')[1];
  const roleName = roleArg.split('=')[1];

  const { db, close } = await createScriptDb();

  try {
    // Find user
    const [foundUser] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);
    if (!foundUser) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }
    console.log(`User: ${foundUser.name} (${foundUser.email})`);

    // Find role
    const [foundRole] = await db
      .select()
      .from(schema.role)
      .where(eq(schema.role.name, roleName))
      .limit(1);
    if (!foundRole) {
      console.error(`Role not found: ${roleName}`);
      console.log('Run "pnpm rbac:init" first to create default roles.');
      process.exit(1);
    }
    console.log(`Role: ${foundRole.title} (${foundRole.name})`);

    // Check if already assigned
    const [existing] = await db
      .select()
      .from(schema.userRole)
      .where(
        and(
          eq(schema.userRole.userId, foundUser.id),
          eq(schema.userRole.roleId, foundRole.id)
        )
      )
      .limit(1);

    if (existing) {
      console.log('\nAlready assigned. No changes made.');
      process.exit(0);
    }

    // Calculate expiration
    let expiresAt: Date | undefined;
    if (expiresDaysArg) {
      const days = parseInt(expiresDaysArg.split('=')[1]);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      console.log(`Expires: ${expiresAt.toISOString()}`);
    }

    // Assign
    await db.insert(schema.userRole).values({
      id: uuidv4(),
      userId: foundUser.id,
      roleId: foundRole.id,
      expiresAt: expiresAt || null,
    });

    console.log(`\nDone: ${email} is now ${roleName}.`);
  } finally {
    await close();
  }
}

assignRole()
  .catch(console.error)
  .finally(() => process.exit(0));
