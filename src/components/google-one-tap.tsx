'use client';

import { useEffect, useRef } from 'react';

import { getAuthClient, useSession } from '@/core/auth/client';
import { currentPathWithQuery } from '@/lib/redirect';
import { usePublicConfig } from '@/hooks/use-public-config';

// Mounts the Google One Tap prompt for signed-out visitors when the
// admin has enabled it. Self-contained: pulls config from
// /api/config/public, gates on session, and triggers at most once
// per page load.
export function GoogleOneTap() {
  const { data: session, isPending } = useSession();
  const { data: configs } = usePublicConfig();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (!configs) return;
    if (isPending) return;
    if (session?.user) return;
    if (
      configs.google_one_tap_enabled !== 'true' ||
      !configs.google_client_id
    ) {
      return;
    }

    triggered.current = true;
    const client = getAuthClient(configs);
    (client as any)
      .oneTap?.({
        // Stay put: One Tap fires on whatever page the visitor is reading.
        callbackURL: currentPathWithQuery('/'),
        onPromptNotification: () => {
          // Silently ignore dismissals / FedCM hiccups — the user can still
          // sign in via the normal /sign-in page.
        },
      })
      .catch(() => {
        // Same — One Tap cancellations throw NetworkError/AbortError that
        // aren't actionable.
      });
  }, [configs, session, isPending]);

  return null;
}
