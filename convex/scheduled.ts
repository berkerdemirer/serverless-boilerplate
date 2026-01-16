import { internalMutation, internalAction } from './_generated/server';
import { v } from 'convex/values';

/**
 * Internal scheduled functions for cron jobs.
 *
 * These functions are called by the cron scheduler defined in crons.ts.
 * They are internal (not exposed to clients) for security.
 */

/**
 * Clean up sessions older than 30 days.
 * Example of a cleanup task.
 */
export const cleanupOldSessions = internalMutation({
  args: {},
  returns: v.object({
    deleted: v.number(),
  }),
  handler: async () => {
    // const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Example: Find and delete old sessions
    // const oldSessions = await ctx.db
    //   .query('sessions')
    //   .withIndex('by_created', (q) => q.lt('createdAt', thirtyDaysAgo))
    //   .collect();
    //
    // for (const session of oldSessions) {
    //   await ctx.db.delete(session._id);
    // }
    //
    // return { deleted: oldSessions.length };

    console.log('Cleanup task ran at', new Date().toISOString());
    return { deleted: 0 };
  },
});

/**
 * Send daily digest emails.
 * Example of a notification task.
 */
export const sendDailyDigest = internalAction({
  args: {},
  returns: v.object({
    sent: v.number(),
  }),
  handler: async () => {
    // Example: Get users who want daily digests and send emails
    // const users = await ctx.runQuery(internal.users.getUsersWithDigestEnabled);
    //
    // for (const user of users) {
    //   const digest = await ctx.runQuery(internal.activity.getDailyDigest, {
    //     userId: user._id
    //   });
    //
    //   await ctx.runAction(internal.email.sendInternal, {
    //     to: user.email,
    //     subject: 'Your Daily Digest',
    //     html: renderDigestEmail(digest)
    //   });
    // }
    //
    // return { sent: users.length };

    console.log('Daily digest task ran at', new Date().toISOString());
    return { sent: 0 };
  },
});

/**
 * Weekly maintenance tasks.
 * Example of aggregation/maintenance work.
 */
export const weeklyMaintenance = internalMutation({
  args: {},
  returns: v.null(),
  handler: async () => {
    // Example: Archive old data, update statistics, etc.
    // await ctx.db.insert('maintenanceLogs', {
    //   type: 'weekly',
    //   completedAt: Date.now(),
    // });

    console.log('Weekly maintenance ran at', new Date().toISOString());
    return null;
  },
});

/**
 * Frequent health check.
 * Example of a monitoring task.
 */
export const frequentCheck = internalAction({
  args: {},
  returns: v.null(),
  handler: async () => {
    // Example: Check external service health, update status
    // const healthStatus = await fetch('https://api.example.com/health');
    // if (!healthStatus.ok) {
    //   // Alert or log
    // }

    console.log('Health check ran at', new Date().toISOString());
    return null;
  },
});
