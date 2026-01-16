import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),

  // File storage metadata
  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    uploadedBy: v.union(v.string(), v.null()),
    uploadedAt: v.number(),
  }).index('by_uploader', ['uploadedBy']),
});
