import { createFileRoute } from '@tanstack/react-router';

import { getAllConfigs } from '@/modules/config/service';
import { handlePaymentCallback } from '@/modules/payment/service';

/**
 * GET /api/payment/callback?order_no=xxx&redirect=xxx
 *
 * After payment (e.g. Alipay return_url), this endpoint:
 * 1. Queries the payment provider for the latest order status
 * 2. Updates the order in DB if paid
 * 3. Redirects to the final destination (same-origin only)
 */
function resolveSameOriginRedirect(
  input: string | null,
  fallbackUrl: string,
  baseUrl: string
): string {
  if (!input) return fallbackUrl;
  try {
    const appUrl = new URL(baseUrl);
    const target = new URL(input, appUrl);
    if (target.origin !== appUrl.origin) return fallbackUrl;
    return target.toString();
  } catch {
    return fallbackUrl;
  }
}

async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const orderNo = url.searchParams.get('order_no');
  const redirect = url.searchParams.get('redirect');
  const configs = await getAllConfigs();
  const appUrl = configs.app_url || 'http://localhost:3000';
  const fallback = `${appUrl}/settings/billing`;

  try {
    if (orderNo) {
      await handlePaymentCallback(orderNo);
    }
  } catch (error: any) {
    console.error('payment callback error:', error);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: resolveSameOriginRedirect(redirect, fallback, appUrl),
    },
  });
}

export const Route = createFileRoute('/api/payment/callback')({
  server: {
    handlers: { GET },
  },
});
