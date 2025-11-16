const cron = require('node-cron');
require('dotenv').config();
const { getNewInboxEntries, getMaxInboxTimestamp } = require('../models/inboxModel');
const { sendNotificationToMobileBackend } = require('./notificationService');

// Track the last processed inbox timestamp
let lastProcessedTimestamp = null;
let isRunning = false;
let lastExecutionTime = 0;
const MIN_EXECUTION_INTERVAL = 1000; // Minimum 1 second between executions (even if cron runs more frequently)

/**
 * Process new inbox entries and send notifications
 */
async function processNewInboxEntries() {
  // Prevent concurrent executions
  if (isRunning) {
    console.log('Inbox cron job is already running, skipping this execution');
    return;
  }

  // Enforce minimum interval between executions to prevent overwhelming the database
  const now = Date.now();
  const timeSinceLastExecution = now - lastExecutionTime;
  if (timeSinceLastExecution < MIN_EXECUTION_INTERVAL) {
    // Skip if executed too recently
    return;
  }

  isRunning = true;
  lastExecutionTime = now;
  console.log(`[${new Date().toISOString()}] Starting inbox check...`);

  try {
    // Get new inbox entries based on UPDATE_TIMESTAMP
    // This may return empty array on database timeout, which is handled gracefully
    const newEntries = await getNewInboxEntries(lastProcessedTimestamp);

    if (newEntries && newEntries.length > 0) {
      console.log(`Found ${newEntries.length} new inbox entries`);

      // Send notification to mobile backend
      const notificationSent = await sendNotificationToMobileBackend(newEntries);

      if (notificationSent) {
        // Update last processed timestamp to the maximum timestamp from the new entries
        // Try different possible timestamp column names
        const timestamps = newEntries
          .map(entry => {
            return entry.UPDATE_TIMESTAMP || entry.update_timestamp || entry.UPDATED_AT || entry.updated_at;
          })
          .filter(ts => ts != null);

        if (timestamps.length > 0) {
          // Get the maximum timestamp
          const maxTimestamp = timestamps.reduce((max, ts) => {
            const tsDate = new Date(ts);
            const maxDate = new Date(max);
            return tsDate > maxDate ? ts : max;
          });
          
          lastProcessedTimestamp = maxTimestamp;
          console.log(`Updated last processed timestamp to: ${lastProcessedTimestamp}`);
        }
      } else {
        console.error('Notification failed, will retry on next run');
      }
    } else {
      console.log('No new inbox entries found');
    }
  } catch (error) {
    // Handle errors gracefully - don't let cron job crash
    if (error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
      console.warn('Database connection error in cron job, will retry on next run:', error.code);
    } else {
      console.error('Error processing inbox entries:', error);
    }
  } finally {
    isRunning = false;
    console.log(`[${new Date().toISOString()}] Inbox check completed`);
  }
}

/**
 * Initialize the last processed timestamp on startup
 */
async function initializeLastProcessedTimestamp() {
  try {
    const maxTimestamp = await getMaxInboxTimestamp();
    lastProcessedTimestamp = maxTimestamp;
    if (lastProcessedTimestamp) {
      console.log(`Initialized last processed inbox timestamp: ${lastProcessedTimestamp}`);
    } else {
      console.log('No previous timestamp found, will process entries from last 24 hours on first run');
    }
  } catch (error) {
    console.error('Error initializing last processed timestamp:', error);
    // Continue with null, will process entries from last 24 hours on first run
  }
}

/**
 * Start the cron job
 * Cron expression is read from INBOX_CRON_EXPRESSION environment variable
 * Defaults to '* * * * * *' (every second) if not set
 */
function startInboxCronJob() {
  // Initialize last processed timestamp on startup
  initializeLastProcessedTimestamp();

  // Get cron expression from environment variable, default to every second if not set
  // Cron format with seconds: second minute hour day month weekday
  // '* * * * * *' means: every second
  // '*/5 * * * * *' means: every 5 seconds
  // '*/5 * * * *' means: every 5 minutes (without seconds field)
  const cronExpression = process.env.INBOX_CRON_EXPRESSION || '* * * * * *';
  
  console.log('Starting inbox cron job');
  console.log(`Cron expression from env: ${process.env.INBOX_CRON_EXPRESSION || 'not set, using default'}`);
  console.log(`Using cron expression: ${cronExpression}`);

  cron.schedule(cronExpression, async () => {
    await processNewInboxEntries();
  });

  // Also run once immediately on startup (optional)
  // Uncomment the line below if you want to check immediately on server start
  // processNewInboxEntries();
}

/**
 * Stop the cron job (if needed)
 */
function stopInboxCronJob() {
  // This would require storing the cron task reference
  // For now, we'll just log
  console.log('Stopping inbox cron job');
}

module.exports = {
  startInboxCronJob,
  stopInboxCronJob,
  processNewInboxEntries // Export for manual testing
};

