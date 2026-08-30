import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { subscription } from '@/config/db/schema';
import { hasPermission } from '@/modules/rbac/service';
import { respErr, respPage } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.*');
    if (!isAdmin) return respErr('Forbidden');

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const offset = (page - 1) * pageSize;

    const status = searchParams.get('status');
    const interval = searchParams.get('interval');

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(subscription.status, status));
    if (interval) conditions.push(eq(subscription.interval, interval));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db()
      .select({ count: count() })
      .from(subscription)
      .where(where);
    const total = totalResult.count;

    const subscriptions = await db()
      .select({
        id: subscription.id,
        subscriptionNo: subscription.subscriptionNo,
        userId: subscription.userId,
        userEmail: subscription.userEmail,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval,
        paymentProvider: subscription.paymentProvider,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        description: subscription.description,
        createdAt: subscription.createdAt,
      })
      .from(subscription)
      .where(where)
      .orderBy(desc(subscription.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(subscriptions, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/subscriptions')({
  server: {
    handlers: { GET },
  },
});
