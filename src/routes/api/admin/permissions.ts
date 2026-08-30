import { createFileRoute } from '@tanstack/react-router';
import { and, count, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { permission } from '@/config/db/schema';
import {
  createPermission,
  deletePermission,
  hasPermission,
  updatePermission,
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const offset = (page - 1) * pageSize;
    const search = searchParams.get('search');

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        or(
          like(permission.code, `%${search}%`),
          like(permission.title, `%${search}%`)
        )!
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db()
      .select({ count: count() })
      .from(permission)
      .where(where);
    const total = totalResult.count;

    const permissions = await db()
      .select()
      .from(permission)
      .where(where)
      .limit(pageSize)
      .offset(offset);

    return respPage(permissions, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { code, resource, action, title } = await request.json();
    if (!code || !resource || !action || !title) {
      return respErr('code, resource, action, and title are required');
    }
    const result = await createPermission({ code, resource, action, title });
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function PUT({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { id, code, resource, action, title, description } =
      await request.json();
    if (!id) return respErr('ID is required');
    const result = await updatePermission(id, {
      code,
      resource,
      action,
      title,
      description,
    });
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
    await deletePermission(id);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/permissions')({
  server: {
    handlers: { GET, POST, PUT, DELETE },
  },
});
