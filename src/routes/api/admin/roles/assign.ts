import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  assignRoleToUser,
  hasPermission,
  removeRoleFromUser,
} from '@/modules/rbac/service';
import { respErr, respOk } from '@/lib/resp';

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.*');
    if (!isAdmin) return respErr('Forbidden');

    const { userId, roleId } = await request.json();
    if (!userId || !roleId) return respErr('userId and roleId are required');

    await assignRoleToUser(userId, roleId);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function DELETE({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.*');
    if (!isAdmin) return respErr('Forbidden');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roleId = searchParams.get('roleId');
    if (!userId || !roleId) return respErr('userId and roleId are required');

    await removeRoleFromUser(userId, roleId);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/roles/assign')({
  server: {
    handlers: { POST, DELETE },
  },
});
