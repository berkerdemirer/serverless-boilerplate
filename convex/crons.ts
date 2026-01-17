import { cronJobs } from 'convex/server';

const crons = cronJobs();

// Add your cron jobs here
// Example:
// crons.interval('cleanup', { hours: 1 }, internal.scheduled.cleanup);

export default crons;
