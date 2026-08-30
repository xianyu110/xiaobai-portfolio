import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  assignPermissionsToRole,
  getRolePermissions,
  hasPermission,
} from '@/modules/rbac/service';
import { respData, respErr, respOk } from '@/lib/resp';

async function checkAdmin(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');
  const isAdmin = await hasPermission(session.user.id, 'admin.*');
  if (!isAdmin) throw new Error('Forbidden');
  return session;
}

async function GET({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId');
    if (!roleId) return respErr('roleId is required');
    const perms = await getRolePermissions(roleId);
    return respData(perms);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function PUT({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { roleId, permissionIds } = await request.json();
    if (!roleId) return respErr('roleId is required');
    await assignPermissionsToRole(roleId, permissionIds || []);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/roles/permissions')({
  server: {
    handlers: { GET, PUT },
  },
});
