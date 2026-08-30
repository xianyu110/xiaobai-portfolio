/**
 * Post-auth / post-payment redirect helpers.
 *
 * Two kinds of "come back here afterwards" targets flow through the auth pages:
 *
 * - **Internal paths** (`/chat`, `/settings/billing`) — the normal web case.
 *   Navigated to directly. Must stay same-origin, or a crafted `?callbackUrl=`
 *   turns sign-in into an open redirect.
 * - **App protocol URLs** (`myapp://auth/callback`) — a desktop/mobile client
 *   handing off a signed-in session. Those cannot be a better-auth
 *   `callbackURL`, so they detour through the `/auth-callback` page, which
 *   attaches the session token. Only schemes the admin allow-lists are honored.
 */

import { deLocalizeHref } from '@/paraglide/runtime.js';

// Never bounce back into an auth page — that loops.
const AUTH_PATH_RE =
  /^\/(sign-in|sign-up|verify-email|forgot-password|reset-password|auth-callback)(\/|\?|#|$)/;

/**
 * Normalize a redirect target to a same-origin path (`/foo?a=1#b`), or null if
 * it points elsewhere / at an auth page. Absolute URLs on this origin are
 * accepted and reduced to their path.
 */
export function safeInternalPath(
  input: string | null | undefined
): string | null {
  if (!input) return null;

  let path = input;
  if (!path.startsWith('/') || path.startsWith('//')) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) return null;
    try {
      const url = new URL(path, origin);
      if (url.origin !== origin) return null;
      path = url.pathname + url.search + url.hash;
    } catch {
      return null;
    }
  }

  return AUTH_PATH_RE.test(path) ? null : path;
}

// Schemes that execute or embed rather than hand off to an installed app.
// Never eligible, even if an admin puts them in desktop_auth_schemes — the
// hand-off appends a session token to the URL.
const UNSAFE_SCHEMES = ['javascript', 'data', 'vbscript', 'blob', 'file'];

/** `myapp://auth/callback` → true. `https://…`, `/chat`, junk → false. */
export function isAppProtocolUrl(input: string | null | undefined): boolean {
  if (!input) return false;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(input) || /^https?:/i.test(input))
    return false;
  return !UNSAFE_SCHEMES.includes(getUrlScheme(input));
}

/** Scheme of an app protocol URL, lowercased (`myapp://x` → `myapp`). */
export function getUrlScheme(input: string): string {
  const match = /^([a-z][a-z0-9+.-]*):/i.exec(input);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Whether a desktop hand-off target is allowed, per the admin's
 * `desktop_auth_schemes` setting (comma-separated, e.g. `myapp,myapp-dev`).
 * Empty setting = the hand-off is off, which is the template default.
 */
export function isAllowedAppProtocolUrl(
  input: string | null | undefined,
  allowedSchemes: string | undefined
): boolean {
  if (!isAppProtocolUrl(input) || !allowedSchemes) return false;
  const scheme = getUrlScheme(input as string);
  return allowedSchemes
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(scheme);
}

/**
 * Where to send the user once they are signed in.
 *
 * `redirect` accepts either kind of target; `callbackUrl` is always an
 * internal path. An app protocol URL detours through `/auth-callback`.
 */
export function resolveAfterAuthUrl(params: {
  redirect?: string | null;
  callbackUrl?: string | null;
  fallback?: string;
}): string {
  const { redirect, callbackUrl, fallback = '/settings' } = params;
  if (isAppProtocolUrl(redirect)) {
    // Scheme allow-listing happens on /auth-callback, which is the only place
    // that can hand out a token.
    return `/auth-callback?redirect=${encodeURIComponent(redirect as string)}`;
  }
  return (
    safeInternalPath(callbackUrl) || safeInternalPath(redirect) || fallback
  );
}

/**
 * Current path + query, for "bring me back here afterwards". De-localized
 * (`/zh/chat` → `/chat`) because internal hrefs in this app are locale-free —
 * the router rewrite adds the prefix back on the way out.
 */
export function currentPathWithQuery(fallback = '/'): string {
  if (typeof window === 'undefined') return fallback;
  const path = deLocalizeHref(window.location.pathname);
  return `${path}${window.location.search}`;
}
