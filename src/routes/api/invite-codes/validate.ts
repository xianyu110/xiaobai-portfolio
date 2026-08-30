import { createFileRoute } from '@tanstack/react-router';

import { validateInviteCode } from '@/modules/invite-codes/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1000,
    keyPrefix: 'invite-validate',
  });
  if (limited) return limited;

  try {
    const body = await request.json().catch(() => ({}));
    const code = String(body?.code || '').trim();
    if (!code) return respErr('Invite code is required');

    const result = await validateInviteCode(code);
    if (!result.valid) {
      return respErr(result.error || 'Invalid invite code');
    }

    return respData({ valid: true, trialDays: result.trialDays });
  } catch (e: any) {
    console.log('validate invite code failed:', e);
    return respErr(e?.message || 'Validation failed');
  }
}

export const Route = createFileRoute('/api/invite-codes/validate')({
  server: {
    handlers: { POST },
  },
});
