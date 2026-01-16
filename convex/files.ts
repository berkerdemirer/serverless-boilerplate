import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * File Storage Functions
 *
 * These functions demonstrate how to use Convex's built-in file storage
 * for uploading and managing files.
 *
 * Upload flow:
 * 1. Client calls generateUploadUrl() to get a short-lived upload URL
 * 2. Client POSTs the file directly to that URL
 * 3. Client receives a storageId from the upload response
 * 4. Client calls saveFile() to save metadata and link the file to a record
 */

/**
 * Generate a short-lived URL for uploading a file.
 * The URL expires after 1 hour.
 */
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    // Optional: Add authentication check
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata after upload.
 * Call this after successfully uploading a file to the URL from generateUploadUrl.
 */
export const saveFile = mutation({
  args: {
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
  },
  returns: v.id('files'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const fileId = await ctx.db.insert('files', {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      uploadedBy: identity?.subject ?? null,
      uploadedAt: Date.now(),
    });

    return fileId;
  },
});

/**
 * Get a file's URL by its storage ID.
 * Returns null if the file doesn't exist.
 */
export const getFileUrl = query({
  args: {
    storageId: v.id('_storage'),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * List all files uploaded by the current user.
 */
export const listMyFiles = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('files'),
      _creationTime: v.number(),
      storageId: v.id('_storage'),
      fileName: v.string(),
      contentType: v.string(),
      uploadedAt: v.number(),
      url: v.union(v.string(), v.null()),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const files = await ctx.db
      .query('files')
      .withIndex('by_uploader', (q) => q.eq('uploadedBy', identity.subject))
      .order('desc')
      .collect();

    // Get URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        _id: file._id,
        _creationTime: file._creationTime,
        storageId: file.storageId,
        fileName: file.fileName,
        contentType: file.contentType,
        uploadedAt: file.uploadedAt,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );

    return filesWithUrls;
  },
});

/**
 * Delete a file and its metadata.
 */
export const deleteFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;

    // Optional: Check ownership
    const identity = await ctx.auth.getUserIdentity();
    if (identity && file.uploadedBy !== identity.subject) {
      throw new Error('Unauthorized: You can only delete your own files');
    }

    // Delete the file from storage
    await ctx.storage.delete(file.storageId);

    // Delete the metadata
    await ctx.db.delete(args.fileId);

    return null;
  },
});
