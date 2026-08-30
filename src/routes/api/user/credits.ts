import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, isNull, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { credit } from '@/config/db/schema';
import { respErr, respPage } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const offset = (page - 1) * pageSize;

    const transactionType = searchParams.get('transactionType');
    const search = searchParams.get('search');

    const conditions: SQL[] = [
      eq(credit.userId, session.user.id),
      isNull(credit.deletedAt) as unknown as SQL,
    ];
    if (transactionType)
      conditions.push(eq(credit.transactionType, transactionType));
    if (search) {
      conditions.push(
        or(
          like(credit.transactionNo, `%${search}%`),
          like(credit.description, `%${search}%`)
        )!
      );
    }

    const where = and(...conditions);

    const [totalResult] = await db()
      .select({ count: count() })
      .from(credit)
      .where(where);

    const rows = await db()
      .select({
        id: credit.id,
        transactionNo: credit.transactionNo,
        transactionType: credit.transactionType,
        transactionScene: credit.transactionScene,
        credits: credit.credits,
        remainingCredits: credit.remainingCredits,
        description: credit.description,
        status: credit.status,
        expiresAt: credit.expiresAt,
        createdAt: credit.createdAt,
      })
      .from(credit)
      .where(where)
      .orderBy(desc(credit.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(rows, totalResult.count);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/credits')({
  server: {
    handlers: { GET },
  },
});
