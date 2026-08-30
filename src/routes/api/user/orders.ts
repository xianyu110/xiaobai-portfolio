import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { order } from '@/config/db/schema';
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

    const paymentType = searchParams.get('paymentType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const conditions: SQL[] = [eq(order.userId, session.user.id)];
    if (paymentType) conditions.push(eq(order.paymentType, paymentType));
    if (status) conditions.push(eq(order.status, status));
    if (search) {
      conditions.push(
        or(
          like(order.orderNo, `%${search}%`),
          like(order.productName, `%${search}%`),
          like(order.planName, `%${search}%`)
        )!
      );
    }

    const where = and(...conditions);

    const [totalResult] = await db()
      .select({ count: count() })
      .from(order)
      .where(where);

    const rows = await db()
      .select({
        id: order.id,
        orderNo: order.orderNo,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        paymentProvider: order.paymentProvider,
        paymentType: order.paymentType,
        productName: order.productName,
        planName: order.planName,
        invoiceUrl: order.invoiceUrl,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      })
      .from(order)
      .where(where)
      .orderBy(desc(order.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(rows, totalResult.count);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/orders')({
  server: {
    handlers: { GET },
  },
});
