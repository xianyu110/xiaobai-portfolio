'use client';

import { LogOutIcon, SettingsIcon, ShieldIcon } from 'lucide-react';

import { signOut } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SiteUserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const router = useRouter();
  const { data } = useUserPermissions();
  const isAdmin = data?.isAdmin === true;

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2">
        <Avatar className="size-9">
          <AvatarImage src={image || undefined} alt={name} />
          <AvatarFallback className="text-xs">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback className="text-xs">
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
        <DropdownMenuItem render={<Link href="/settings" />}>
          <SettingsIcon className="size-4" />
          {m['common.nav.settings']()}
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldIcon className="size-4" />
            {m['common.systems.admin']()}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="size-4" />
          {m['common.sign.sign_out_title']()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
