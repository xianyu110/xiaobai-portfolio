'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import { localizeHref } from '@/paraglide/runtime.js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export interface NavSubItem {
  href: string;
  label: string;
  newTab?: boolean;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  newTab?: boolean;
  /** Sub-items render as a collapsible group under this item. */
  items?: NavSubItem[];
}

export function AppSidebar({
  brand,
  brandHref = '/',
  navItems,
  footerNavItems,
  footer,
}: {
  brand: React.ReactNode;
  brandHref?: string;
  navItems: NavItem[];
  footerNavItems?: NavItem[];
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  // Group nav items by their (static) group label.
  const groups: { label?: string; items: NavItem[] }[] = [];
  let currentGroup: string | undefined = '__initial__';
  for (const item of navItems) {
    if (item.group !== currentGroup) {
      groups.push({ label: item.group, items: [item] });
      currentGroup = item.group;
    } else {
      groups[groups.length - 1].items.push(item);
    }
  }

  // The first nav item (dashboard root, e.g. /admin) matches exactly; everything
  // else matches by path prefix so sub-routes light up their entry.
  const isActiveHref = (href: string) =>
    href === navItems[0]?.href
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  // Hrefs of parent items whose sub-items contain the current route.
  const activeParents = () => {
    const set = new Set<string>();
    for (const item of navItems) {
      if (item.items?.some((sub) => isActiveHref(sub.href))) set.add(item.href);
    }
    return set;
  };

  // Which collapsible parents are open. Seeded with the active parent (SSR-safe,
  // derived from the path), then merged with the persisted set after mount.
  const storageKey = `sidebar-open:${brandHref}`;
  const [openItems, setOpenItems] = useState<Set<string>>(activeParents);

  useEffect(() => {
    let saved: string[] | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch {}
    setOpenItems(() => {
      const next = saved ? new Set(saved) : new Set<string>();
      for (const href of activeParents()) next.add(href);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Keep the active parent open as the route changes, without touching others.
  useEffect(() => {
    setOpenItems((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const href of activeParents()) {
        if (!next.has(href)) {
          next.add(href);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function toggleItem(href: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={brandHref}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
            >
              <span className="flex-1 font-serif text-lg leading-none italic">
                {brand}
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  // Collapsible parent with sub-items.
                  if (item.items?.length) {
                    const open = openItems.has(item.href);
                    const childActive = item.items.some((sub) =>
                      isActiveHref(sub.href)
                    );
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={childActive && !open}
                          aria-expanded={open}
                          onClick={() => toggleItem(item.href)}
                        >
                          <Icon />
                          <span>{item.label}</span>
                          <ChevronRight
                            className={`text-muted-foreground ml-auto size-4 shrink-0 transition-transform ${
                              open ? 'rotate-90' : ''
                            }`}
                          />
                        </SidebarMenuButton>
                        {open && (
                          <SidebarMenuSub>
                            {item.items.map((sub) => (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  render={<Link href={sub.href} />}
                                  isActive={isActiveHref(sub.href)}
                                >
                                  <span>{sub.label}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  }

                  // Plain link.
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActiveHref(item.href)}
                        >
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {footerNavItems && footerNavItems.length > 0 && (
          <SidebarMenu>
            {footerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.newTab
                ? false
                : item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const button = (
                <SidebarMenuButton tooltip={item.label} isActive={isActive}>
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              );
              return (
                <SidebarMenuItem key={item.href}>
                  {item.newTab ? (
                    <a
                      href={localizeHref(item.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {button}
                    </a>
                  ) : (
                    <Link href={item.href}>{button}</Link>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}
        {footer}
      </SidebarFooter>
    </Sidebar>
  );
}
