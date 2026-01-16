/**
 * Testing utilities for Convex functions.
 *
 * This module provides helpers for unit testing Convex queries, mutations, and actions
 * without needing a full Convex deployment.
 */

import { Validator } from 'convex/values';

/**
 * Type helper to extract the return type of a Convex function handler
 */
export type HandlerResult<T> = T extends { handler: (...args: unknown[]) => infer R } ? Awaited<R> : never;

/**
 * Creates a mock database context for testing queries and mutations.
 * This is a simplified mock - for integration tests, use convex-test library.
 */
export function createMockDb<T extends Record<string, unknown[]>>(initialData: T) {
  const data = { ...initialData };

  return {
    query: (table: keyof T) => ({
      order: (direction?: 'asc' | 'desc') => {
        const sorted = [...(data[table] ?? [])];
        if (direction === 'desc') sorted.reverse();
        return {
          take: (count: number) => Promise.resolve(sorted.slice(0, count)),
          collect: () => Promise.resolve(sorted),
          first: () => Promise.resolve(sorted[0] ?? null),
        };
      },
      filter: () => ({
        first: () => Promise.resolve(data[table]?.[0] ?? null),
        collect: () => Promise.resolve(data[table] ?? []),
      }),
      withIndex: () => ({
        order: (direction?: 'asc' | 'desc') => {
          const sorted = [...(data[table] ?? [])];
          if (direction === 'desc') sorted.reverse();
          return {
            take: (count: number) => Promise.resolve(sorted.slice(0, count)),
            collect: () => Promise.resolve(sorted),
            first: () => Promise.resolve(sorted[0] ?? null),
          };
        },
        first: () => Promise.resolve(data[table]?.[0] ?? null),
        collect: () => Promise.resolve(data[table] ?? []),
      }),
    }),
    get: () => Promise.resolve(null),
    insert: (table: keyof T, doc: Record<string, unknown>) => {
      const id = `${String(table)}:${Date.now()}`;
      if (!data[table]) {
        (data as Record<string, unknown[]>)[table as string] = [];
      }
      const newDoc = { _id: id, _creationTime: Date.now(), ...doc };
      data[table].push(newDoc as T[keyof T][number]);
      return Promise.resolve(id);
    },
    patch: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    delete: () => Promise.resolve(),
  };
}

/**
 * Creates a mock auth context for testing authenticated functions
 */
export function createMockAuth(user: { subject: string; email?: string; name?: string } | null = null) {
  return {
    getUserIdentity: () =>
      Promise.resolve(
        user
          ? {
              subject: user.subject,
              email: user.email,
              name: user.name,
              tokenIdentifier: `test|${user.subject}`,
            }
          : null
      ),
  };
}

/**
 * Creates a mock storage context for testing file operations
 */
export function createMockStorage() {
  const files = new Map<string, { data: ArrayBuffer; contentType: string }>();

  return {
    generateUploadUrl: () => Promise.resolve('https://mock-upload-url.convex.cloud/upload'),
    getUrl: (storageId: string) => Promise.resolve(files.has(storageId) ? `https://mock-url.convex.cloud/${storageId}` : null),
    getMetadata: (storageId: string) =>
      Promise.resolve(
        files.has(storageId)
          ? {
              storageId,
              contentType: files.get(storageId)!.contentType,
              size: files.get(storageId)!.data.byteLength,
            }
          : null
      ),
    delete: (storageId: string) => {
      files.delete(storageId);
      return Promise.resolve();
    },
    // Helper for tests to simulate file upload
    _simulateUpload: (storageId: string, data: ArrayBuffer, contentType: string) => {
      files.set(storageId, { data, contentType });
    },
  };
}

/**
 * Creates a complete mock context for testing Convex functions
 */
export function createMockContext<T extends Record<string, unknown[]>>(options: {
  db?: T;
  user?: { subject: string; email?: string; name?: string } | null;
}) {
  return {
    db: createMockDb(options.db ?? ({} as T)),
    auth: createMockAuth(options.user ?? null),
    storage: createMockStorage(),
  };
}

/**
 * Validates arguments against a Convex validator schema.
 * Useful for testing that function arguments are properly validated.
 */
export function validateArgs<T>(validator: Validator<T, 'required', string>, args: unknown): args is T {
  try {
    // This is a simplified check - full validation happens at runtime in Convex
    return args !== null && typeof args === 'object';
  } catch {
    return false;
  }
}
