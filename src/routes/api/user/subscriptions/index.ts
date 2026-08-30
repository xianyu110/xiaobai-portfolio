import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { subscription } from '@/config/db/schema';
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

    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const conditions: SQL[] = [eq(subscription.userId, session.user.id)];
    if (status && status !== 'all') {
      conditions.push(eq(subscription.status, status));
    }
    if (search) {
      conditions.push(
        or(
          like(subscription.subscriptionNo, `%${search}%`),
          like(subscription.planName, `%${search}%`),
          like(subscription.productName, `%${search}%`)
        )!
      );
    }

    const where = and(...conditions);

    const [totalResult] = await db()
      .select({ count: count() })
      .from(subscription)
      .where(where);

    const rows = await db()
      .select()
      .from(subscription)
      .where(where)
      .orderBy(desc(subscription.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(rows, totalResult.count);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/subscriptions/')({
  server: {
    handlers: { GET },
  },
});
