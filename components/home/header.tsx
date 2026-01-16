'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { User } from '@workos-inc/node';
import { ThemeSwitcher } from '@/components/theme-switcher';

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
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.email}</span>
      <button onClick={onSignOut} className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
        Sign out
      </button>
    </div>
  );
}
