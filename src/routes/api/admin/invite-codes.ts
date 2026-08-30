import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, gte, like, or, sql, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { inviteCode } from '@/config/db/schema';
import {
  createInviteCode,
  createInviteCodesBatch,
  deleteInviteCode,
} from '@/modules/invite-codes/service';
import { hasPermission } from '@/modules/rbac/service';
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
    const status = searchParams.get('status'); // 'available' | 'used'

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        or(
          like(inviteCode.code, `%${search}%`),
          like(inviteCode.note, `%${search}%`)
        )!
      );
    }
    if (status === 'available') {
      conditions.push(sql`${inviteCode.usedCount} < ${inviteCode.maxUses}`);
      conditions.push(
        or(
          sql`${inviteCode.expiresAt} IS NULL`,
          gte(inviteCode.expiresAt, new Date())
        )!
      );
    } else if (status === 'used') {
      conditions.push(sql`${inviteCode.usedCount} >= ${inviteCode.maxUses}`);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db()
      .select({ count: count() })
      .from(inviteCode)
      .where(where);
    const total = totalResult.count;

    const rows = await db()
      .select()
      .from(inviteCode)
      .where(where)
      .orderBy(desc(inviteCode.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(rows, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const session = await checkAdmin(request);
    const body = await request.json().catch(() => ({}));
    const {
      code,
      count: batchCount,
      maxUses,
      trialDays,
      note,
      expiresAt,
    } = body as {
      code?: string;
      count?: number;
      maxUses?: number;
      trialDays?: number;
      note?: string;
      expiresAt?: string | null;
    };

    const expires = expiresAt ? new Date(expiresAt) : null;
    const params = {
      maxUses: typeof maxUses === 'number' ? maxUses : undefined,
      trialDays: typeof trialDays === 'number' ? trialDays : undefined,
      note,
      createdBy: session.user.id,
      expiresAt: expires,
    };

    if (typeof batchCount === 'number' && batchCount > 1) {
      const limited = Math.min(100, Math.max(1, batchCount));
      const rows = await createInviteCodesBatch({ ...params, count: limited });
      return respData(rows);
    }

    const row = await createInviteCode({ code, ...params });
    return respData(row);
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
    await deleteInviteCode(id);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/invite-codes')({
  server: {
    handlers: { GET, POST, DELETE },
  },
});
