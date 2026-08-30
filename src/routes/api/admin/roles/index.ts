import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { role } from '@/config/db/schema';
import {
  createRole,
  deleteRole,
  getRoles,
  getUserRoles,
  hasPermission,
  updateRole,
} from '@/modules/rbac/service';
import { respData, respErr, respOk, respPage } from '@/lib/resp';

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
    const userId = searchParams.get('userId');

    if (userId) {
      const roles = await getUserRoles(userId);
      return respData(roles);
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const offset = (page - 1) * pageSize;
    const search = searchParams.get('search');

    const conditions: SQL[] = [eq(role.status, 'active')];
    if (search) {
      conditions.push(
        or(like(role.name, `%${search}%`), like(role.title, `%${search}%`))!
      );
    }
    const where = and(...conditions);

    const [totalResult] = await db()
      .select({ count: count() })
      .from(role)
      .where(where);
    const total = totalResult.count;

    const roles = await db()
      .select()
      .from(role)
      .where(where)
      .orderBy(desc(role.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(roles, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { name, title, description } = await request.json();
    if (!name || !title) return respErr('Name and title are required');
    const result = await createRole({ name, title, description });
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function PUT({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { id, name, title, description } = await request.json();
    if (!id) return respErr('ID is required');
    const result = await updateRole(id, { name, title, description });
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function DELETE({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return respErr('ID is required');
    await deleteRole(id);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/roles/')({
  server: {
    handlers: { GET, POST, PUT, DELETE },
  },
});
