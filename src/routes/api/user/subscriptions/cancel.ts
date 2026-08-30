import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { cancelUserSubscription } from '@/modules/payment/service';
import { respData, respErr } from '@/lib/resp';

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = await request.json().catch(() => ({}));
    const subscriptionNo = body?.subscriptionNo;
    if (!subscriptionNo || typeof subscriptionNo !== 'string') {
      return respErr('subscriptionNo is required');
    }

    const updated = await cancelUserSubscription({
      userId: session.user.id,
      subscriptionNo,
    });

    return respData(updated);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/subscriptions/cancel')({
  server: {
    handlers: { POST },
  },
});
