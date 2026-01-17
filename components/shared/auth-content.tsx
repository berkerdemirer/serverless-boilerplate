'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthContent() {
  return (
    <>
      <Authenticated>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-muted-foreground">You are signed in. Start building your app!</p>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <p className="text-muted-foreground">Sign in to get started</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
