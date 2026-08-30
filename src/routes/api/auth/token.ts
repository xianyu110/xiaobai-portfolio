import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { respData, respErr } from '@/lib/resp';

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

/**
 * GET /api/auth/token
 *
 * Returns the current session token for the logged-in user.
 * Used by the auth-callback page to pass the token to the desktop client
 * via custom protocol URL (her://auth/callback?token=xxx).
 */
async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const cookies = parseCookies(request.headers.get('cookie'));
    // Cookie name varies: __Secure- prefix when using HTTPS
    const token =
      cookies['better-auth.session_token'] ||
      cookies['__Secure-better-auth.session_token'];

    if (!token) {
      return respErr('No session token found');
    }

    // Also return the cookie name so client knows which to use
    const cookieName =
      '__Secure-better-auth.session_token' in cookies
        ? '__Secure-better-auth.session_token'
        : 'better-auth.session_token';

    return respData({ token, cookieName });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/auth/token')({
  server: {
    handlers: { GET },
  },
});
