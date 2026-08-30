export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export enum RoleStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}

export function matchPermission(
  permissionCode: string,
  permissionCodes: string[]
): boolean {
  if (permissionCodes.includes(permissionCode)) return true;
  const parts = permissionCode.split('.');
  for (let i = parts.length - 1; i > 0; i--) {
    const wildcard = parts.slice(0, i).join('.') + '.*';
    if (permissionCodes.includes(wildcard)) return true;
  }
  if (permissionCodes.includes('*')) return true;
  return false;
}

export function matchAnyPermission(
  permissionCodes: string[],
  userPermissionCodes: string[]
): boolean {
  for (const code of permissionCodes) {
    if (matchPermission(code, userPermissionCodes)) return true;
  }
  return false;
}

export function matchAllPermissions(
  permissionCodes: string[],
  userPermissionCodes: string[]
): boolean {
  for (const code of permissionCodes) {
    if (!matchPermission(code, userPermissionCodes)) return false;
  }
  return true;
}
