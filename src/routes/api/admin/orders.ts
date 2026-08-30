import { createFileRoute } from '@tanstack/react-router';
import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { order } from '@/config/db/schema';
import { hasPermission } from '@/modules/rbac/service';
import { respErr, respOk, respPage } from '@/lib/resp';

const VALID_STATUSES = ['pending', 'created', 'paid', 'failed', 'deleted'];

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
    const paymentType = searchParams.get('paymentType');
    const search = searchParams.get('search');

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(order.status, status));
    if (paymentType) conditions.push(eq(order.paymentType, paymentType));
    if (search) {
      conditions.push(
        or(
          like(order.orderNo, `%${search}%`),
          like(order.userEmail, `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db()
      .select({ count: count() })
      .from(order)
      .where(where);
    const total = totalResult.count;

    const orders = await db()
      .select({
        id: order.id,
        orderNo: order.orderNo,
        userId: order.userId,
        userEmail: order.userEmail,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        paymentType: order.paymentType,
        paymentProvider: order.paymentProvider,
        productId: order.productId,
        productName: order.productName,
        description: order.description,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
      })
      .from(order)
      .where(where)
      .orderBy(desc(order.createdAt))
      .limit(pageSize)
      .offset(offset);

    return respPage(orders, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function PATCH({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.*');
    if (!isAdmin) return respErr('Forbidden');

    const { orderNo, status, productId, productName, description } =
      await request.json();
    if (!orderNo) return respErr('orderNo is required');
    if (status && !VALID_STATUSES.includes(status))
      return respErr('Invalid status');

    const patch: Record<string, unknown> = {};
    if (status !== undefined) patch.status = status;
    if (productId !== undefined) patch.productId = productId;
    if (productName !== undefined) patch.productName = productName;
    if (description !== undefined) patch.description = description;
    if (Object.keys(patch).length === 0) return respErr('No fields to update');

    await db().update(order).set(patch).where(eq(order.orderNo, orderNo));
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/orders')({
  server: {
    handlers: { GET, PATCH },
  },
});
