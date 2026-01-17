'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { User } from '@workos-inc/node';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-10 flex flex-row items-center justify-between border-b-2 border-slate-200 p-4 dark:border-slate-800">
      Convex + Next.js + WorkOS
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {user && <UserMenu user={user} onSignOut={signOut} />}
      </div>
    </header>
  );
}

function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePictureUrl ?? undefined} alt={user.firstName ?? 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
