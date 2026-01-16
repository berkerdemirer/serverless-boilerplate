import { cronJobs } from 'convex/server';
// import { internal } from './_generated/api';

/**
 * Scheduled Functions (Cron Jobs)
 *
 * Convex supports recurring scheduled functions using cron syntax.
 * These run automatically at the specified intervals.
 *
 * Available schedule methods:
 * - crons.interval() - Run every N minutes/hours/etc
 * - crons.hourly() - Run at specific minute each hour
 * - crons.daily() - Run at specific time each day (UTC)
 * - crons.weekly() - Run at specific day/time each week
 * - crons.monthly() - Run at specific day/time each month
 * - crons.cron() - Standard cron expression (5 fields)
 *
 * Note: All times are in UTC!
 */

const crons = cronJobs();

// Example: Clean up old data every hour
// Uncomment to enable:
// crons.interval(
//   'cleanup old sessions',
//   { hours: 1 },
//   internal.scheduled.cleanupOldSessions
// );

// Example: Send daily digest at 9am UTC
// crons.daily(
//   'send daily digest',
//   { hourUTC: 9, minuteUTC: 0 },
//   internal.scheduled.sendDailyDigest
// );

// Example: Weekly cleanup on Sundays at midnight UTC
// crons.weekly(
//   'weekly maintenance',
//   { dayOfWeek: 'sunday', hourUTC: 0, minuteUTC: 0 },
//   internal.scheduled.weeklyMaintenance
// );

// Example: Using standard cron syntax (minute hour day month dayOfWeek)
// This runs every 15 minutes:
// crons.cron(
//   'frequent check',
//   '*/15 * * * *',
//   internal.scheduled.frequentCheck
// );

export default crons;
