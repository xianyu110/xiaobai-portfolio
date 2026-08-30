import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

/**
 * ShipAny Code preview bridge — when this app runs inside the sandbox
 * preview iframe, report route changes and the links clickable on the
 * current page to the parent window (its URL bar + route dropdown follow
 * along). A no-op outside an iframe, so production deployments are
 * unaffected.
 */
export function SandboxPreviewBridge() {
  const href = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return;
    const post = (message: unknown) => {
      try {
        window.parent.postMessage(message, '*');
      } catch {
        // Parent refuses messages — ignore.
      }
    };

    post({ type: 'shipany-preview:navigate', path: href });

    // Same-origin links present in the rendered page — collected twice so
    // async content (data-driven lists) is included.
    const collect = () => {
      const seen = new Set<string>();
      for (const a of Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href]')
      )) {
        try {
          const url = new URL(a.href, window.location.href);
          if (url.origin !== window.location.origin) continue;
          seen.add(url.pathname + url.search);
          if (seen.size >= 50) break;
        } catch {
          // Malformed href — skip.
        }
      }
      if (seen.size)
        post({ type: 'shipany-preview:links', links: [...seen].sort() });
    };
    const early = setTimeout(collect, 600);
    const late = setTimeout(collect, 2500);
    return () => {
      clearTimeout(early);
      clearTimeout(late);
    };
  }, [href]);

  return null;
}
