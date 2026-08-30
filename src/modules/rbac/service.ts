import { and, desc, eq, gt, inArray, isNull, or } from 'drizzle-orm';

import { matchAnyPermission, matchPermission, ROLES } from '@/core/auth/rbac';
import { db } from '@/core/db';
import { permission, role, rolePermission, userRole } from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

export { ROLES } from '@/core/auth/rbac';

// --- Role CRUD ---

export async function getRoles() {
  return db()
    .select()
    .from(role)
    .where(eq(role.status, 'active'))
    .orderBy(desc(role.createdAt));
}

export async function getRoleByName(name: string) {
  const [result] = await db()
    .select()
    .from(role)
    .where(eq(role.name, name))
    .limit(1);
  return result;
}

export async function createRole(data: {
  name: string;
  title: string;
  description?: string;
}) {
  const [result] = await db()
    .insert(role)
    .values({ id: getUuid(), ...data, status: 'active' })
    .returning();
  return result;
}

// --- Permission CRUD ---

export async function getPermissions() {
  return db().select().from(permission);
}

export async function createPermission(data: {
  code: string;
  resource: string;
  action: string;
  title: string;
}) {
  const [result] = await db()
    .insert(permission)
    .values({ id: getUuid(), ...data })
    .returning();
  return result;
}

// --- Role-Permission mapping ---

export async function assignPermissionsToRole(
  roleId: string,
  permissionIds: string[]
) {
  // Remove existing
  await db().delete(rolePermission).where(eq(rolePermission.roleId, roleId));

  // Insert new
  if (permissionIds.length > 0) {
    await db()
      .insert(rolePermission)
      .values(
        permissionIds.map((pid) => ({
          id: getUuid(),
          roleId,
          permissionId: pid,
        }))
      );
  }
}

// --- User-Role mapping ---

export async function assignRoleToUser(
  userId: string,
  roleId: string,
  expiresAt?: Date
) {
  const [result] = await db()
    .insert(userRole)
    .values({ id: getUuid(), userId, roleId, expiresAt: expiresAt || null })
    .returning();
  return result;
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  await db()
    .delete(userRole)
    .where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)));
}

// --- Role update/delete ---

export async function updateRole(
  id: string,
  data: { name?: string; title?: string; description?: string }
) {
  const [result] = await db()
    .update(role)
    .set(data)
    .where(eq(role.id, id))
    .returning();
  return result;
}

export async function deleteRole(id: string) {
  await db().update(role).set({ status: 'inactive' }).where(eq(role.id, id));
}

// --- Permission update/delete ---

export async function updatePermission(
  id: string,
  data: {
    code?: string;
    resource?: string;
    action?: string;
    title?: string;
    description?: string;
  }
) {
  const [result] = await db()
    .update(permission)
    .set(data)
    .where(eq(permission.id, id))
    .returning();
  return result;
}

export async function deletePermission(id: string) {
  await db().delete(permission).where(eq(permission.id, id));
}

// --- Role-Permission read ---

export async function getRolePermissions(roleId: string) {
  return db()
    .select({ permissionId: rolePermission.permissionId })
    .from(rolePermission)
    .where(eq(rolePermission.roleId, roleId));
}

// --- User-Role read ---

export async function getUserRoles(userId: string) {
  return db()
    .select({
      id: userRole.id,
      roleId: userRole.roleId,
      expiresAt: userRole.expiresAt,
      roleName: role.name,
      roleTitle: role.title,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, userId));
}

// --- Permission checks ---

export async function getUserPermissionCodes(
  userId: string
): Promise<string[]> {
  const now = new Date();

  // Get user's active roles
  const roles = await db()
    .select({ roleId: userRole.roleId })
    .from(userRole)
    .where(
      and(
        eq(userRole.userId, userId),
        or(isNull(userRole.expiresAt), gt(userRole.expiresAt, now))
      )
    );

  if (roles.length === 0) return [];

  const roleIds = roles.map((r: any) => r.roleId);

  // Get permissions for those roles
  const perms = await db()
    .select({ code: permission.code })
    .from(rolePermission)
    .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
    .where(inArray(rolePermission.roleId, roleIds));

  // Deduplicate
  return [...new Set(perms.map((p: any) => p.code))] as string[];
}

export async function hasPermission(
  userId: string,
  permissionCode: string
): Promise<boolean> {
  const codes = await getUserPermissionCodes(userId);
  return matchPermission(permissionCode, codes);
}

export async function hasAnyPermission(
  userId: string,
  permissionCodes: string[]
): Promise<boolean> {
  const codes = await getUserPermissionCodes(userId);
  return matchAnyPermission(permissionCodes, codes);
}

// --- Auto-grant role for new user ---

export async function grantRoleForNewUser(params: {
  userId: string;
  configs: Record<string, string>;
}) {
  const { userId, configs } = params;

  if (configs.initial_role_enabled !== 'true') return;

  const roleName = configs.initial_role_name;
  if (!roleName) return;

  const foundRole = await getRoleByName(roleName);
  if (!foundRole) return;

  await assignRoleToUser(userId, foundRole.id);
}
