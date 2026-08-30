import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { user } from '@/config/db/schema';
import {
  consume,
  CreditTransactionScene,
  getBalance,
  grant,
} from '@/modules/credits/service';
import { hasPermission } from '@/modules/rbac/service';
import { respData, respErr } from '@/lib/resp';

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.*');
    if (!isAdmin) return respErr('Forbidden');

    const body = await request.json().catch(() => ({}));
    const { userId, action, credits, description } = body as {
      userId?: string;
      action?: 'grant' | 'deduct';
      credits?: number;
      description?: string;
    };

    if (!userId) return respErr('Missing userId');
    if (action !== 'grant' && action !== 'deduct')
      return respErr('Invalid action');
    const amount = Number(credits);
    if (!Number.isFinite(amount) || amount <= 0)
      return respErr('Invalid credits');

    const [target] = await db()
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!target) return respErr('User not found');

    if (action === 'grant') {
      await grant({
        userId,
        userEmail: target.email,
        credits: amount,
        description: description || 'Admin grant',
        scene: CreditTransactionScene.GIFT,
      });
    } else {
      const result = await consume({
        userId,
        userEmail: target.email,
        credits: amount,
        scene: 'admin_deduct',
        description: description || 'Admin deduct',
      });
      if (!result.success) return respErr('Insufficient balance');
    }

    const balance = await getBalance(userId);
    return respData({ balance });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/users/credits')({
  server: {
    handlers: { POST },
  },
});
