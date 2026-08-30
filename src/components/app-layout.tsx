'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/core/auth/client';
import { usePathname, useRouter } from '@/core/i18n/navigation';
import { apiGet } from '@/lib/api-client';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { AppSidebar, type NavItem } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserMenu } from '@/components/user-menu';

export function AppLayout({
  children,
  navItems,
  footerNavItems,
  brand,
  brandHref = '/',
  mobileBrand,
  headerExtra,
  profileHref,
  requirePermission,
  unauthorizedRedirect = '/settings',
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  footerNavItems?: NavItem[];
  brand: React.ReactNode;
  brandHref?: string;
  mobileBrand?: React.ReactNode;
  headerExtra?: React.ReactNode;
  profileHref?: string;
  requirePermission?: string;
  unauthorizedRedirect?: string;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Guard against a double redirect: useLocation() flips to "/sign-in" the moment
  // we navigate (while this layout is still mounted), which would otherwise re-fire
  // the effect and overwrite callbackUrl with the sign-in path itself.
  const redirectingRef = useRef(false);

  // Invite-only gate: needs the user's membership status (also covers social
  // logins). `needsInvite` is computed server-side in /api/user/info.
  const userInfoQuery = useQuery({
    queryKey: ['user-info'],
    queryFn: () => apiGet<{ needsInvite?: boolean }>('/api/user/info'),
    staleTime: 60_000,
    enabled: !!session?.user,
  });
  const needsInvite = userInfoQuery.data?.needsInvite === true;
  const membershipResolved =
    !session?.user || userInfoQuery.isSuccess || userInfoQuery.isError;

  // Only query permissions once we have a session and a permission gate.
  const permissionsEnabled = !!session?.user && !!requirePermission;
  const permissionsQuery = useUserPermissions(permissionsEnabled);
  const isAdmin = permissionsQuery.data?.isAdmin === true;

  // Authorization resolution mirrors the original imperative flow:
  // - no permission gate → authorized once a session exists + membership ok
  // - permission gate → authorized only when the query resolves with isAdmin
  const authorized =
    !!session?.user &&
    membershipResolved &&
    !needsInvite &&
    (!requirePermission || isAdmin);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      // Remember where the user was headed so sign-in can send them back.
      // pathname is already locale-free; append the live query string.
      const search =
        typeof window !== 'undefined' ? window.location.search : '';
      const callbackUrl = `${pathname}${search}`;
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // Invite-only gate: wait for membership status, then bounce unredeemed
    // (incl. social) users to the redeem page. Admins are exempt server-side.
    if (userInfoQuery.isPending) return;
    if (needsInvite) {
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        router.push('/redeem-invite');
      }
      return;
    }

    if (!requirePermission) return;

    // Wait for the permissions query to resolve before deciding.
    if (permissionsQuery.isPending) return;

    if (permissionsQuery.isError || !isAdmin) {
      router.push(unauthorizedRedirect);
    }
  }, [
    isPending,
    session,
    router,
    pathname,
    requirePermission,
    unauthorizedRedirect,
    userInfoQuery.isPending,
    needsInvite,
    permissionsQuery.isPending,
    permissionsQuery.isError,
    isAdmin,
  ]);

  if (isPending || !authorized || !session?.user) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        brand={brand}
        brandHref={brandHref}
        navItems={navItems}
        footerNavItems={footerNavItems}
        footer={
          <UserMenu
            name={session.user.name || 'User'}
            email={session.user.email}
            image={session.user.image}
            profileHref={profileHref}
          />
        }
      />
      {/* min-w-0: let the inset shrink below its content's min-content width —
          otherwise wide tables stretch the page and force horizontal scroll
          instead of scrolling inside their own overflow-x-auto wrappers */}
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1" />
          {headerExtra && (
            <div className="flex items-center gap-1 px-4">{headerExtra}</div>
          )}
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
