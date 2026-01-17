# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack application boilerplate using Next.js 16, Convex (serverless backend/database), and WorkOS AuthKit for authentication.

## Development Commands

```bash
npm run dev          # Start both frontend (Next.js) and backend (Convex) in parallel
npm run dev:frontend # Start Next.js dev server only (port 3000)
npm run dev:backend  # Start Convex dev server only
npm run build        # Build Next.js production bundle (generates sitemap)
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

Before first run: `npx convex dev` sets up the Convex deployment and adds `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

## File Naming Conventions

- **Component files**: Use kebab-case (`theme-provider.tsx`, not `ThemeProvider.tsx`)
- **Directories**: Use kebab-case (`form-fields/`, not `FormFields/`)
- **Convex functions**: Use camelCase (`myFunctions.ts`)

## Architecture

### Frontend (Next.js App Router)

- `app/` - Next.js pages and routes using App Router
- `proxy.ts` - Next.js middleware handling auth routes (sign-in, sign-up, callback)

### Components Structure

- `components/providers/` - Context providers (Convex client, theme)
- `components/layout/` - Layout components (header, navigation)
- `components/shared/` - Shared components (error boundary, theme switcher)
- `components/ui/` - shadcn/ui primitives
- `components/ui/form-fields/` - Form field components with react-hook-form integration

### Backend (Convex)

- `convex/schema.ts` - Database schema definitions
- `convex/auth.config.ts` - WorkOS JWT authentication configuration
- `convex/files.ts` - File storage upload/download functions
- `convex/crons.ts` - Scheduled functions (cron jobs)
- `convex/_generated/` - Auto-generated types (don't edit)

### Authentication Flow

1. Users authenticate via WorkOS redirect flow (`/sign-in`, `/sign-up` routes)
2. OAuth callback handled at `/callback/route.ts`
3. Client components use `useAuth()` hook from WorkOS
4. Server components use `withAuth()` wrapper
5. Convex functions access user via `ctx.auth.getUserIdentity()`

### Data Fetching Patterns

- **Client components**: `useQuery()` and `useMutation()` from Convex React
- **Server components**: `preloadQuery()` with `withAuth()` for SSR
- **Auth guards**: `<Authenticated>` and `<Unauthenticated>` components from Convex

## Convex Development Guidelines

See `.rules/convex_rules.txt` for comprehensive Convex patterns. Key points:

### Function Syntax

Always use the object syntax with validators:

```typescript
import { query } from './_generated/server';
import { v } from 'convex/values';

export const myQuery = query({
  args: { id: v.id('tableName') },
  returns: v.null(),
  handler: async (ctx, args) => {
    return null;
  },
});
```

### Public vs Internal Functions

- `query`, `mutation`, `action` - Public API (exposed to clients)
- `internalQuery`, `internalMutation`, `internalAction` - Private (only callable from other Convex functions)

### Function References

- Public: `api.fileName.functionName`
- Internal: `internal.fileName.functionName`

### Query Best Practices

- Use `withIndex()` instead of `filter()` for queries
- Define indexes in schema for all query patterns
- Use `.order('asc')` or `.order('desc')` for ordering

### Actions

- Add `"use node";` at top of files using Node.js modules
- Actions cannot access `ctx.db` directly - use `ctx.runQuery`/`ctx.runMutation`

## Form Components

Pre-built form field components that integrate shadcn/ui with react-hook-form and Zod validation.

**Location**: `components/ui/form-fields/`

### Available Components

| Component          | Use Case                                               |
| ------------------ | ------------------------------------------------------ |
| `FormRoot`         | Wrapper combining `<Form>` provider + `<form>` element |
| `InputField`       | Text, email, number inputs                             |
| `TextareaField`    | Multi-line text                                        |
| `PasswordField`    | Password with show/hide toggle                         |
| `NumberField`      | Numeric with +/- stepper buttons                       |
| `CheckboxField`    | Boolean checkbox                                       |
| `SwitchField`      | Toggle switch with card layout                         |
| `SelectField`      | Dropdown select                                        |
| `RadioGroupField`  | Radio button group                                     |
| `ComboboxField`    | Searchable select/autocomplete                         |
| `MultiSelectField` | Multi-select with tags                                 |
| `ToggleGroupField` | Button-style single/multiple selection                 |
| `DatePickerField`  | Calendar date picker                                   |
| `SliderField`      | Range slider with optional value display               |
| `OTPField`         | OTP/verification code input                            |
| `FileField`        | Drag-and-drop file upload                              |

### Usage Pattern

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormRoot, InputField, SelectField, CheckboxField } from '@/components/ui/form-fields';

const schema = z.object({
  email: z.string().email(),
  role: z.string(),
  terms: z.boolean().refine((v) => v, 'You must accept terms'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: '', terms: false },
  });

  return (
    <FormRoot form={form} onSubmit={(data) => console.log(data)}>
      <InputField control={form.control} name="email" label="Email" type="email" />
      <SelectField
        control={form.control}
        name="role"
        label="Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]}
      />
      <CheckboxField control={form.control} name="terms" label="Accept terms" />
      <Button type="submit">Submit</Button>
    </FormRoot>
  );
}
```

### Key Props (all fields)

- `control` - From `useForm()`, provides type-safe field name autocomplete
- `name` - Field name matching schema
- `label` - Optional label text
- `description` - Optional helper text

## Email (Resend + React Email)

Email functionality using Resend for delivery and React Email for templates.

**Location**: `convex/email.ts` (Convex action), `emails/` (templates)

### Sending Emails

```tsx
import { useAction } from "convex/react";
import { render } from "@react-email/components";
import { api } from "@/convex/_generated/api";
import { ExampleEmail } from "@/emails/example";

const sendEmail = useAction(api.email.send);

const html = await render(<ExampleEmail name="John" />);

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  html,
});
```

### Creating Email Templates

Use React Email components with Tailwind CSS support:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

export function MyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Preview text shown in inbox</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded-lg bg-white p-10">
            <Text className="text-base text-gray-600">Hello, {name}!</Text>
            <Button
              href="https://example.com"
              className="rounded-md bg-black px-6 py-3 text-white"
            >
              Click me
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

### Available Actions

- `api.email.send` - Public action for client-side calls
- `internal.email.sendInternal` - Internal action for use within Convex functions

## Environment Variables

Required in `.env.local`:

- `WORKOS_CLIENT_ID` - WorkOS application ID
- `WORKOS_API_KEY` - WorkOS API key
- `WORKOS_COOKIE_PASSWORD` - 32+ character encryption key
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` - OAuth callback URL (e.g., `http://localhost:3000/callback`)
- `NEXT_PUBLIC_CONVEX_URL` - Auto-set by `npx convex dev`
- `RESEND_API_KEY` - Resend API key (starts with `re_`)

Optional:

- `SITE_URL` - Your production URL for sitemap generation
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error monitoring
- `SENTRY_ORG` - Sentry organization slug
- `SENTRY_PROJECT` - Sentry project slug
- `SENTRY_AUTH_TOKEN` - Sentry auth token for source map uploads
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Your domain for Plausible analytics
- `NEXT_PUBLIC_PLAUSIBLE_HOST` - Self-hosted Plausible URL (optional)

Required in Convex (set via `npx convex env set`):

- `RESEND_API_KEY` - Same Resend API key for Convex actions

## Testing

Unit testing with Vitest. Tests are located alongside source files with `.test.ts` suffix.

**Location**: `convex/*.test.ts`, `vitest.config.ts`

### Running Tests

```bash
npm run test         # Run all tests once
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createMockContext } from './testing';

describe('myFunction', () => {
  it('should work correctly', async () => {
    const ctx = createMockContext({
      db: { users: [{ _id: 'user:1', name: 'Test' }] },
      user: { subject: 'user123' },
    });

    // Test your function logic
    const result = await ctx.db.query('users').order('desc').take(10);
    expect(result).toHaveLength(1);
  });
});
```

### Testing Utilities

`convex/testing.ts` provides mock utilities:

- `createMockContext()` - Creates mock db, auth, and storage context
- `createMockDb()` - Mock database with query/insert/patch/delete
- `createMockAuth()` - Mock authentication context
- `createMockStorage()` - Mock file storage

## Error Handling

### Error Pages

- `app/not-found.tsx` - Custom 404 page
- `app/error.tsx` - Error boundary for route segments
- `app/global-error.tsx` - Catches errors in root layout

### Error Boundary Component

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error) => console.error(error)}
>
  <MyComponent />
</ErrorBoundary>
```

Or use the HOC:

```tsx
import { withErrorBoundary } from '@/components/error-boundary';

const SafeComponent = withErrorBoundary(MyComponent, {
  fallback: <div>Error</div>,
});
```

## Logging

Logging using Pino with pretty-printing in development and JSON output in production.

**Location**: `lib/logger.ts`

```typescript
import { logger } from '@/lib/logger';

logger.debug('Debug message', { userId: '123' });
logger.info('User logged in', { email: 'user@example.com' });
logger.warn('Rate limit approaching', { remaining: 5 });
logger.error('Failed to process', { orderId: '456' });
logger.exception(error, { context: 'payment' });

// Child logger with preset context
const orderLogger = logger.child({ orderId: '789' });
orderLogger.info('Order created'); // Includes orderId automatically
```

## Rate Limiting

Rate limiting using Upstash Ratelimit with sliding window algorithm.

**Location**: `lib/rate-limit.ts`

Uses Redis in production, falls back to in-memory for development.

```typescript
import { rateLimiters, createRateLimiter, getRateLimitHeaders } from '@/lib/rate-limit';

// Using preset limiters (async)
const result = await rateLimiters.standard(userIp); // 60 req/min
const result = await rateLimiters.strict(userIp);   // 10 req/min
const result = await rateLimiters.auth(userIp);     // 5 req/15min

if (!result.success) {
  return new Response('Too Many Requests', {
    status: 429,
    headers: getRateLimitHeaders(result),
  });
}

// Custom rate limiter
const customLimiter = createRateLimiter(100, '1m');
const result = await customLimiter('user:123');
```

**Required environment variables:**
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

Get free credentials at [upstash.com](https://upstash.com)

## File Storage (Convex)

Built-in file storage for uploads.

**Location**: `convex/files.ts`

### Upload Flow

```tsx
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const generateUploadUrl = useMutation(api.files.generateUploadUrl);
const saveFile = useMutation(api.files.saveFile);

async function uploadFile(file: File) {
  // 1. Get upload URL
  const uploadUrl = await generateUploadUrl();

  // 2. Upload file directly
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  const { storageId } = await response.json();

  // 3. Save metadata
  await saveFile({
    storageId,
    fileName: file.name,
    contentType: file.type,
  });
}
```

### Available Functions

- `api.files.generateUploadUrl` - Get temporary upload URL
- `api.files.saveFile` - Save file metadata after upload
- `api.files.getFileUrl` - Get download URL for a file
- `api.files.listMyFiles` - List current user's files
- `api.files.deleteFile` - Delete file and metadata

## Scheduled Functions (Cron Jobs)

Run tasks on a schedule.

**Location**: `convex/crons.ts`

### Defining Cron Jobs

```typescript
// convex/crons.ts
import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Every hour
crons.interval('cleanup', { hours: 1 }, internal.tasks.cleanup);

// Daily at 9am UTC
crons.daily('digest', { hourUTC: 9, minuteUTC: 0 }, internal.tasks.sendDigest);

// Weekly on Sunday
crons.weekly('maintenance', { dayOfWeek: 'sunday', hourUTC: 0, minuteUTC: 0 }, internal.tasks.maintenance);

// Standard cron syntax
crons.cron('frequent', '*/15 * * * *', internal.tasks.frequentCheck);

export default crons;
```

## HTTP Actions (Webhooks)

Custom HTTP endpoints for webhooks and APIs.

### Creating HTTP Actions

Create `convex/http.ts` to define custom HTTP endpoints:

```typescript
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/my-endpoint',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    // Process request, call mutations/queries
    await ctx.runMutation(internal.myFunction, { data: body });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default http;
```

## SEO

### Metadata

Root metadata is in `app/layout.tsx`. For page-specific metadata:

```tsx
// app/my-page/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page', // Becomes "My Page | My App"
  description: 'Description for this page',
};
```

### Sitemap & Robots

Generated automatically on build via `next-sitemap`.

- Config: `next-sitemap.config.js`
- Output: `public/sitemap.xml`, `public/robots.txt`

## Analytics (Plausible)

Privacy-friendly analytics using Plausible.

**Location**: `lib/analytics.ts`, `app/layout.tsx`

### Setup

1. Create a Plausible account at [plausible.io](https://plausible.io) (or self-host)
2. Add your domain to Plausible
3. Add environment variable to `.env.local`:

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# For self-hosted Plausible (optional)
NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.yourdomain.com
```

### Features

- **Automatic page views** - All page navigations are tracked automatically
- **Outbound link tracking** - External link clicks are tracked
- **Privacy-friendly** - No cookies, GDPR compliant by default
- **Lightweight** - < 1KB script

### Custom Events

```tsx
// In React components - use the hook
import { usePlausible } from '@/lib/analytics';

function MyComponent() {
  const plausible = usePlausible();

  const handleSignup = () => {
    plausible('signup', { props: { plan: 'pro' } });
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}

// Outside React - use the function
import { trackEvent } from '@/lib/analytics';

trackEvent('purchase', {
  props: { product: 'Pro Plan' },
  revenue: { currency: 'USD', amount: 29.99 }
});
```

## Error Monitoring (Sentry)

Sentry integration for error tracking, performance monitoring, and session replay.

**Location**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`

### Setup

1. Create a Sentry project at [sentry.io](https://sentry.io)
2. Add environment variables to `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token  # For source map uploads
```

### Features

- **Automatic error capture** - All unhandled errors are reported
- **Performance tracing** - Track request timing and bottlenecks
- **Session replay** - Record user sessions for debugging (privacy-safe)
- **Source maps** - Readable stack traces in production

### Manual Error Capture

```typescript
import * as Sentry from '@sentry/nextjs';

// Capture an exception
Sentry.captureException(new Error('Something went wrong'));

// Capture with context
Sentry.captureException(error, {
  user: { id: 'user-123', email: 'user@example.com' },
  tags: { feature: 'checkout' },
  extra: { orderId: '456' },
});

// Capture a message
Sentry.captureMessage('User completed onboarding');
```

### Configuration Files

| File | Purpose |
|------|---------|
| `sentry.client.config.ts` | Browser-side SDK configuration |
| `sentry.server.config.ts` | Node.js server configuration |
| `sentry.edge.config.ts` | Edge runtime configuration |
| `instrumentation.ts` | Next.js instrumentation hook |
| `next.config.ts` | Sentry webpack plugin |

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml`:

- **lint** - ESLint + Prettier check
- **typecheck** - TypeScript compilation
- **test** - Vitest tests

Build and deployment are handled by Vercel.
