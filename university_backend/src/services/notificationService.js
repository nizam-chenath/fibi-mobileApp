const { callExternalApiWithoutCookies } = require('../utils/externalApiCall');
require('dotenv').config();

/**
 * Send notification to mobile backend for new inbox entries
 */
async function sendNotificationToMobileBackend(inboxEntries) {
  try {
    const mobileBackendBaseUrl = process.env.MOBILE_BACKEND_BASE_URL;

    if (!mobileBackendBaseUrl) {
      console.error('MOBILE_BACKEND_BASE_URL not set in environment variables');
      throw new Error('Mobile backend base URL not configured');
    }

    const endpoint = '/api/notifications/new-entry';
    
    // Prepare notification payload
    const notificationData = {
      entries: inboxEntries,
      timestamp: new Date().toISOString(),
      count: inboxEntries.length
    };

    console.log(`Sending notification for ${inboxEntries.length} new inbox entries to mobile backend`);
    console.log(`Mobile backend URL: ${mobileBackendBaseUrl}`);
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Full URL will be: ${mobileBackendBaseUrl}${endpoint}`);

    // Call mobile backend notification API without cookies
    const result = await callExternalApiWithoutCookies(
      mobileBackendBaseUrl,
      endpoint,
      'POST',
      notificationData
    );

    if (result) {
      console.log('Successfully sent notification to mobile backend');
      return true;
    } else {
      console.error('Failed to send notification to mobile backend');
      return false;
    }
  } catch (error) {
    console.error('Error in sendNotificationToMobileBackend:', error);
    throw error;
  }
}

module.exports = {
  sendNotificationToMobileBackend
};

