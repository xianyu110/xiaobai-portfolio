import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getCurrentSubscription } from '@/modules/subscriptions/service';
import { respData, respErr } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const sub = await getCurrentSubscription(session.user.id);
    return respData(sub || null);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/subscriptions/current')({
  server: {
    handlers: { GET },
  },
});
