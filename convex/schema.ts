import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    uploadedBy: v.union(v.string(), v.null()),
    uploadedAt: v.number(),
  }).index('by_uploader', ['uploadedBy']),
});
