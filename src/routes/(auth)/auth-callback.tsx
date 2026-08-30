import { useEffect, useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { apiGet } from '@/lib/api-client';
import {
  isAllowedAppProtocolUrl,
  isAppProtocolUrl,
  safeInternalPath,
} from '@/lib/redirect';
import { m } from '@/paraglide/messages.js';
import { localizeHref } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';

/**
 * /auth-callback?redirect=<target>
 *
 * Landing pad between "you are now signed in" and where you were going:
 *
 * - internal path → straight there
 * - allow-listed app protocol (`myapp://…`) → fetch the session token and hand
 *   it to the client via `?token=…`; this is why the page exists at all, since
 *   better-auth can only redirect to http(s) origins it trusts
 *
 * Anything else falls back to `/`. The allow-list is the admin setting
 * `desktop_auth_schemes` — empty (the template default) means no hand-off.
 */
function AuthCallbackPage() {
  const { data: session, isPending } = useSession();
  const configQuery = usePublicConfig();
  const handledRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (handledRef.current) return;
    if (isPending || !configQuery.isSuccess) return;

    const target = new URLSearchParams(window.location.search).get('redirect');
    const internalPath = safeInternalPath(target);

    // Web target, or nothing usable: no token involved, just go.
    if (!isAppProtocolUrl(target)) {
      handledRef.current = true;
      window.location.replace(localizeHref(internalPath || '/'));
      return;
    }

    const allowed = isAllowedAppProtocolUrl(
      target,
      configQuery.data?.desktop_auth_schemes
    );
    if (!allowed) {
      handledRef.current = true;
      window.location.replace(localizeHref('/'));
      return;
    }

    // Signing in is what produces the token — bounce and come back.
    if (!session?.user) {
      handledRef.current = true;
      window.location.replace(
        localizeHref(
          `/sign-in?redirect=${encodeURIComponent(target as string)}`
        )
      );
      return;
    }

    handledRef.current = true;
    apiGet<{ token: string }>('/api/auth/token')
      .then(({ token }) => {
        const url = target as string;
        const separator = url.includes('?') ? '&' : '?';
        window.location.href = `${url}${separator}token=${encodeURIComponent(token)}`;
      })
      .catch((err: Error) => {
        handledRef.current = false;
        setError(err.message || m['common.auth_callback.error']());
      });
  }, [isPending, session?.user, configQuery.isSuccess, configQuery.data]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-3 p-6">
      {error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : (
        <>
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
          <p className="text-muted-foreground text-sm">
            {m['common.auth_callback.redirecting']()}
          </p>
        </>
      )}
    </div>
  );
}

export const Route = createFileRoute('/(auth)/auth-callback')({
  component: AuthCallbackPage,
});
