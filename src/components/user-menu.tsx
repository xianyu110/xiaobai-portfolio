import {
  CheckIcon,
  EllipsisVerticalIcon,
  LanguagesIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { signOut } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { localeNames } from '@/config/locale';
import { m } from '@/paraglide/messages.js';
import {
  getLocale,
  locales,
  localizeHref,
  setLocale,
} from '@/paraglide/runtime.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function UserMenu({
  name,
  email,
  image,
  profileHref,
}: {
  name: string;
  email: string;
  image?: string | null;
  profileHref?: string;
}) {
  const router = useRouter();
  const locale = getLocale();
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  function handleLocaleSwitch(newLocale: string) {
    // Writes the locale cookie and reloads on the localized URL.
    setLocale(newLocale as typeof locale);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="ring-sidebar-ring w-full rounded-lg outline-none focus-visible:ring-2 [&>div]:w-full">
            <SidebarMenuButton
              size="lg"
              render={<div />}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback className="rounded-lg text-xs">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="text-foreground/70 truncate text-xs">
                  {email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={image || undefined} alt={name} />
                    <AvatarFallback className="rounded-lg text-xs">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {profileHref && (
              <DropdownMenuItem
                onClick={() => {
                  window.open(localizeHref(profileHref), '_blank');
                }}
              >
                <UserIcon className="size-4" />
                {m['common.nav.profile']()}
              </DropdownMenuItem>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 px-2 py-2">
                <LanguagesIcon className="size-4" />
                <span className="flex-1">{localeNames[locale] || locale}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => handleLocaleSwitch(loc)}
                  >
                    <span className="flex-1">{localeNames[loc] || loc}</span>
                    {loc === locale && <CheckIcon className="size-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 px-2 py-2">
                <PaletteIcon className="size-4" />
                <span className="flex-1">
                  {theme === 'dark'
                    ? m['common.nav.theme_dark']()
                    : theme === 'light'
                      ? m['common.nav.theme_light']()
                      : m['common.nav.theme_system']()}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <SunIcon className="size-4" />
                  <span className="flex-1">
                    {m['common.nav.theme_light']()}
                  </span>
                  {theme === 'light' && <CheckIcon className="size-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <MoonIcon className="size-4" />
                  <span className="flex-1">{m['common.nav.theme_dark']()}</span>
                  {theme === 'dark' && <CheckIcon className="size-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <MonitorIcon className="size-4" />
                  <span className="flex-1">
                    {m['common.nav.theme_system']()}
                  </span>
                  {theme === 'system' && <CheckIcon className="size-3.5" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon className="size-4" />
              {m['common.sign.sign_out_title']()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
