import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { user } from '@/config/db/schema';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

/**
 * POST /api/user/is-email-verified
 *
 * Authenticated-only. Returns whether the requesting user's own email has been
 * verified. Lookup is keyed by the SESSION user id, not the request body —
 * this prevents the endpoint from being used as a user-enumeration oracle.
 */
async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1000,
    keyPrefix: 'is-email-verified',
  });
  if (limited) return limited;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const [row] = await db()
      .select({ emailVerified: user.emailVerified })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    return respData({ emailVerified: !!row?.emailVerified });
  } catch (e) {
    console.log('check email verified failed:', e);
    return respErr('check email verified failed');
  }
}

export const Route = createFileRoute('/api/user/is-email-verified')({
  server: {
    handlers: { POST },
  },
});
