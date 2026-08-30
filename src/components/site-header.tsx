'use client';

import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function SiteHeader({ navLinks }: { navLinks?: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <span className="font-serif text-lg italic">
            {envConfigs.app_name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks?.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSelector />
          <ThemeToggle />
          {user ? (
            <SiteUserMenu
              name={user.name || 'User'}
              email={user.email}
              image={user.image}
            />
          ) : (
            <Link href="/settings" className={cn(buttonVariants(), 'gap-1.5')}>
              {m['common.nav.get_started']()}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-border border-t px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="border-border mt-3 flex items-center gap-2 border-t pt-3">
            <LocaleSelector />
            <ThemeToggle />
            <div className="flex-1" />
            {user ? (
              <SiteUserMenu
                name={user.name || 'User'}
                email={user.email}
                image={user.image}
              />
            ) : (
              <Link
                href="/settings"
                className={cn(buttonVariants(), 'gap-1.5')}
                onClick={() => setMobileOpen(false)}
              >
                {m['common.nav.get_started']()}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
