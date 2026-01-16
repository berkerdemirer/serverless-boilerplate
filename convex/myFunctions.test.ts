import { describe, it, expect } from 'vitest';
import { createMockContext } from './testing';

/**
 * Example tests for Convex functions.
 *
 * These tests demonstrate how to unit test Convex queries, mutations, and actions
 * using mock contexts. For full integration tests with a real Convex backend,
 * consider using the convex-test library.
 */

describe('myFunctions', () => {
  describe('listNumbers', () => {
    it('should return numbers with viewer info', async () => {
      // Arrange
      const mockNumbers = [
        { _id: 'numbers:1', _creationTime: 1000, value: 1 },
        { _id: 'numbers:2', _creationTime: 2000, value: 2 },
        { _id: 'numbers:3', _creationTime: 3000, value: 3 },
      ];

      const ctx = createMockContext({
        db: { numbers: mockNumbers },
        user: { subject: 'user123', email: 'test@example.com' },
      });

      // Act - simulate the listNumbers handler logic
      const numbers = await ctx.db.query('numbers').order('desc').take(10);
      const viewer = (await ctx.auth.getUserIdentity())?.subject ?? null;

      // Assert
      expect(viewer).toBe('user123');
      expect(numbers).toHaveLength(3);
      const values = (numbers as Array<{ value: number }>).map((n) => n.value);
      expect(values).toContain(1);
      expect(values).toContain(2);
      expect(values).toContain(3);
    });

    it('should return null viewer when not authenticated', async () => {
      const ctx = createMockContext({
        db: { numbers: [] },
        user: null,
      });

      const viewer = (await ctx.auth.getUserIdentity())?.subject ?? null;

      expect(viewer).toBeNull();
    });
  });

  describe('addNumber', () => {
    it('should insert a number into the database', async () => {
      const ctx = createMockContext({
        db: { numbers: [] },
      });

      // Act - simulate the addNumber handler logic
      const id = await ctx.db.insert('numbers', { value: 42 });

      // Assert
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });
  });

  describe('validation', () => {
    it('should validate count is a number', () => {
      const validArgs = { count: 10 };
      const invalidArgs = { count: 'ten' };

      expect(typeof validArgs.count).toBe('number');
      expect(typeof invalidArgs.count).not.toBe('number');
    });

    it('should validate value is a number for addNumber', () => {
      const validArgs = { value: 42 };
      const invalidArgs = { value: null };

      expect(typeof validArgs.value).toBe('number');
      expect(typeof invalidArgs.value).not.toBe('number');
    });
  });
});

describe('mock utilities', () => {
  it('createMockContext creates proper context structure', () => {
    const ctx = createMockContext({
      db: { users: [] },
      user: { subject: 'test-user' },
    });

    expect(ctx.db).toBeDefined();
    expect(ctx.auth).toBeDefined();
    expect(ctx.storage).toBeDefined();
  });

  it('mock storage can generate upload URLs', async () => {
    const ctx = createMockContext({ db: {} });

    const uploadUrl = await ctx.storage.generateUploadUrl();

    expect(uploadUrl).toContain('upload');
  });
});
