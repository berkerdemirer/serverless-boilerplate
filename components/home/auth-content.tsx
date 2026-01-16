'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInForm } from './sign-in-form';
import { DashboardContent } from './dashboard-content';

/**
 * Client component that handles auth state branching.
 * Uses Convex's Authenticated/Unauthenticated components for reactive auth state.
 */
export function AuthContent() {
  return (
    <>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}
