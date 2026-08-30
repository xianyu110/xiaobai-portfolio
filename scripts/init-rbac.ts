/**
 * RBAC Initialization Script
 *
 * Creates default roles and permissions.
 *
 * Usage:
 *   pnpm rbac:init
 *   pnpm rbac:init --admin-email=admin@example.com
 *   pnpm rbac:init --admin-email=admin@example.com --admin-password=your-password
 */

import { hashPassword } from 'better-auth/crypto';
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

const defaultPermissions = [
  // Admin access
  {
    code: 'admin.access',
    resource: 'admin',
    action: 'access',
    title: 'Admin Access',
    description: 'Access to admin area',
  },

  // Users management
  {
    code: 'admin.users.read',
    resource: 'users',
    action: 'read',
    title: 'Read Users',
    description: 'View user list and details',
  },
  {
    code: 'admin.users.write',
    resource: 'users',
    action: 'write',
    title: 'Write Users',
    description: 'Create and update users',
  },
  {
    code: 'admin.users.delete',
    resource: 'users',
    action: 'delete',
    title: 'Delete Users',
    description: 'Delete users',
  },

  // Posts management
  {
    code: 'admin.posts.read',
    resource: 'posts',
    action: 'read',
    title: 'Read Posts',
    description: 'View post list and details',
  },
  {
    code: 'admin.posts.write',
    resource: 'posts',
    action: 'write',
    title: 'Write Posts',
    description: 'Create and update posts',
  },
  {
    code: 'admin.posts.delete',
    resource: 'posts',
    action: 'delete',
    title: 'Delete Posts',
    description: 'Delete posts',
  },

  // Categories management
  {
    code: 'admin.categories.read',
    resource: 'categories',
    action: 'read',
    title: 'Read Categories',
    description: 'View category list and details',
  },
  {
    code: 'admin.categories.write',
    resource: 'categories',
    action: 'write',
    title: 'Write Categories',
    description: 'Create and update categories',
  },
  {
    code: 'admin.categories.delete',
    resource: 'categories',
    action: 'delete',
    title: 'Delete Categories',
    description: 'Delete categories',
  },

  // Payments management
  {
    code: 'admin.payments.read',
    resource: 'payments',
    action: 'read',
    title: 'Read Payments',
    description: 'View payment list and details',
  },

  // Subscriptions management
  {
    code: 'admin.subscriptions.read',
    resource: 'subscriptions',
    action: 'read',
    title: 'Read Subscriptions',
    description: 'View subscription list and details',
  },

  // Credits management
  {
    code: 'admin.credits.read',
    resource: 'credits',
    action: 'read',
    title: 'Read Credits',
    description: 'View credit list and details',
  },
  {
    code: 'admin.credits.write',
    resource: 'credits',
    action: 'write',
    title: 'Write Credits',
    description: 'Grant or consume credits',
  },

  // API Keys management
  {
    code: 'admin.apikeys.read',
    resource: 'apikeys',
    action: 'read',
    title: 'Read API Keys',
    description: 'View API key list and details',
  },
  {
    code: 'admin.apikeys.write',
    resource: 'apikeys',
    action: 'write',
    title: 'Write API Keys',
    description: 'Create and update API keys',
  },
  {
    code: 'admin.apikeys.delete',
    resource: 'apikeys',
    action: 'delete',
    title: 'Delete API Keys',
    description: 'Delete API keys',
  },

  // Settings management
  {
    code: 'admin.settings.read',
    resource: 'settings',
    action: 'read',
    title: 'Read Settings',
    description: 'View system settings',
  },
  {
    code: 'admin.settings.write',
    resource: 'settings',
    action: 'write',
    title: 'Write Settings',
    description: 'Update system settings',
  },

  // Roles & Permissions management
  {
    code: 'admin.roles.read',
    resource: 'roles',
    action: 'read',
    title: 'Read Roles',
    description: 'View roles and permissions',
  },
  {
    code: 'admin.roles.write',
    resource: 'roles',
    action: 'write',
    title: 'Write Roles',
    description: 'Create and update roles',
  },
  {
    code: 'admin.roles.delete',
    resource: 'roles',
    action: 'delete',
    title: 'Delete Roles',
    description: 'Delete roles',
  },

  // Permissions management
  {
    code: 'admin.permissions.read',
    resource: 'permissions',
    action: 'read',
    title: 'Read Permissions',
    description: 'View permission list and details',
  },
  {
    code: 'admin.permissions.write',
    resource: 'permissions',
    action: 'write',
    title: 'Write Permissions',
    description: 'Create and update permissions',
  },
  {
    code: 'admin.permissions.delete',
    resource: 'permissions',
    action: 'delete',
    title: 'Delete Permissions',
    description: 'Delete permissions',
  },

  // AI Tasks management
  {
    code: 'admin.ai-tasks.read',
    resource: 'ai-tasks',
    action: 'read',
    title: 'Read AI Tasks',
    description: 'View AI task list and details',
  },
  {
    code: 'admin.ai-tasks.write',
    resource: 'ai-tasks',
    action: 'write',
    title: 'Write AI Tasks',
    description: 'Create and update AI tasks',
  },
  {
    code: 'admin.ai-tasks.delete',
    resource: 'ai-tasks',
    action: 'delete',
    title: 'Delete AI Tasks',
    description: 'Delete AI tasks',
  },

  // Wildcard permission for super admin
  {
    code: '*',
    resource: 'all',
    action: 'all',
    title: 'Super Admin',
    description: 'All permissions (super admin only)',
  },
];

const defaultRoles = [
  {
    name: 'super_admin',
    title: 'Super Admin',
    description: 'Full system access with all permissions',
    status: 'active',
    sort: 1,
    permissions: ['*'],
  },
  {
    name: 'admin',
    title: 'Admin',
    description: 'Administrator with most permissions',
    status: 'active',
    sort: 2,
    permissions: [
      'admin.access',
      'admin.users.*',
      'admin.posts.*',
      'admin.categories.*',
      'admin.payments.*',
      'admin.subscriptions.*',
      'admin.credits.*',
      'admin.apikeys.*',
      'admin.settings.read',
      'admin.ai-tasks.*',
    ],
  },
  {
    name: 'editor',
    title: 'Editor',
    description: 'Content editor with limited permissions',
    status: 'active',
    sort: 3,
    permissions: [
      'admin.access',
      'admin.posts.read',
      'admin.posts.write',
      'admin.categories.read',
      'admin.categories.write',
    ],
  },
  {
    name: 'viewer',
    title: 'Viewer',
    description: 'Read-only access to admin area',
    status: 'active',
    sort: 4,
    permissions: [
      'admin.access',
      'admin.users.read',
      'admin.posts.read',
      'admin.categories.read',
      'admin.payments.read',
      'admin.subscriptions.read',
      'admin.credits.read',
    ],
  },
];

async function initializeRBAC() {
  console.log('Starting RBAC initialization...\n');

  const provider = process.env.DATABASE_PROVIDER || 'sqlite';
  console.log(`Database provider: ${provider}\n`);

  const { db, close } = await createScriptDb();

  try {
    // 1. Create permissions
    console.log('Creating permissions...');
    const createdPermissions: Record<string, string> = {};

    for (const perm of defaultPermissions) {
      const [existing] = await db
        .select()
        .from(schema.permission)
        .where(eq(schema.permission.code, perm.code))
        .limit(1);
      if (existing) {
        createdPermissions[perm.code] = existing.id;
        console.log(`  [skip] ${perm.code}`);
      } else {
        const id = uuidv4();
        await db.insert(schema.permission).values({ id, ...perm });
        createdPermissions[perm.code] = id;
        console.log(`  [new]  ${perm.code}`);
      }
    }

    console.log(`\nPermissions: ${Object.keys(createdPermissions).length}\n`);

    // 2. Create roles and assign permissions
    console.log('Creating roles...');
    const createdRoles: Record<string, string> = {};

    for (const roleData of defaultRoles) {
      const [existingRole] = await db
        .select()
        .from(schema.role)
        .where(eq(schema.role.name, roleData.name))
        .limit(1);

      let roleId: string;
      if (existingRole) {
        roleId = existingRole.id;
        console.log(`  [skip] ${roleData.name}`);
      } else {
        roleId = uuidv4();
        await db.insert(schema.role).values({
          id: roleId,
          name: roleData.name,
          title: roleData.title,
          description: roleData.description,
          status: roleData.status,
          sort: roleData.sort,
        });
        console.log(`  [new]  ${roleData.name}`);
      }
      createdRoles[roleData.name] = roleId;

      // Clear and reassign permissions
      await db
        .delete(schema.rolePermission)
        .where(eq(schema.rolePermission.roleId, roleId));

      for (const permCode of roleData.permissions) {
        if (permCode.endsWith('.*')) {
          const prefix = permCode.slice(0, -2);
          const matchingPerms = Object.entries(createdPermissions)
            .filter(([code]) => code.startsWith(prefix + '.'))
            .map(([, id]) => id);
          for (const permId of matchingPerms) {
            await db.insert(schema.rolePermission).values({
              id: uuidv4(),
              roleId,
              permissionId: permId,
            });
          }
        } else {
          const permId = createdPermissions[permCode];
          if (permId) {
            await db.insert(schema.rolePermission).values({
              id: uuidv4(),
              roleId,
              permissionId: permId,
            });
          }
        }
      }
      console.log(
        `         -> assigned ${roleData.permissions.length} permissions`
      );
    }

    console.log(`\nRoles: ${Object.keys(createdRoles).length}\n`);

    // 3. Create admin user and/or assign super_admin role
    const args = process.argv.slice(2);
    const adminEmailArg = args.find((arg) => arg.startsWith('--admin-email='));
    const adminPasswordArg = args.find((arg) =>
      arg.startsWith('--admin-password=')
    );

    if (adminEmailArg) {
      const adminEmail = adminEmailArg.split('=')[1];
      const adminPassword = adminPasswordArg?.split('=')[1];

      let [adminUser] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, adminEmail))
        .limit(1);

      if (!adminUser && adminPassword) {
        // Create user + account
        console.log(`Creating admin user: ${adminEmail}...`);
        const userId = uuidv4();
        const hashedPassword = await hashPassword(adminPassword);

        await db.insert(schema.user).values({
          id: userId,
          name: 'Admin',
          email: adminEmail,
          emailVerified: true,
        });

        await db.insert(schema.account).values({
          id: uuidv4(),
          accountId: userId,
          providerId: 'credential',
          userId,
          password: hashedPassword,
        });

        [adminUser] = await db
          .select()
          .from(schema.user)
          .where(eq(schema.user.id, userId))
          .limit(1);
        console.log(`  Created: ${adminEmail}`);
      } else if (!adminUser) {
        console.log(`  User not found: ${adminEmail}`);
        console.log(
          '  Add --admin-password=xxx to create the user automatically.'
        );
      }

      if (adminUser) {
        const superAdminRoleId = createdRoles['super_admin'];
        const [existing] = await db
          .select()
          .from(schema.userRole)
          .where(
            and(
              eq(schema.userRole.userId, adminUser.id),
              eq(schema.userRole.roleId, superAdminRoleId)
            )
          )
          .limit(1);

        if (!existing) {
          await db.insert(schema.userRole).values({
            id: uuidv4(),
            userId: adminUser.id,
            roleId: superAdminRoleId,
          });
          console.log(`  Done: ${adminEmail} is now super_admin`);
        } else {
          console.log(`  Already super_admin: ${adminEmail}`);
        }
      }
    } else {
      console.log('To create an admin user, run:');
      console.log(
        '  pnpm rbac:init --admin-email=admin@example.com --admin-password=your-password'
      );
    }

    console.log('\nRBAC initialization complete.');
  } finally {
    await close();
  }
}

initializeRBAC()
  .catch(console.error)
  .finally(() => process.exit(0));
