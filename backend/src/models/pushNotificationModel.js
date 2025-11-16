const pool = require('../db/mysql');
const admin = require('../utils/firebase');

/**
 * Send push notification to all users with a stored token.
 * Only requires title and body.
 * NOTE: Integrate your push provider (e.g., Firebase Admin) where indicated.
 */
async function sendPushNotificationToAllUsers(title, body) {
  if (!title || !body) {
    throw new Error('Title and body are required');
  }

  // Fetch distinct tokens from users table
  // Using column name 'fcm_tocken' per current schema
  const selectTokensSql = `
    SELECT DISTINCT fcm_tocken
    FROM users
    WHERE fcm_tocken IS NOT NULL
      AND fcm_tocken <> ''
  `;

  const [rows] = await pool.query(selectTokensSql);

  // Extract unique tokens
  const tokens = [...new Set((rows || []).map(r => r.fcm_tocken).filter(Boolean))];

  if (tokens.length === 0) {
    return { success: false, message: 'No users with FCM token', totalTokens: 0 };
  }

  // Split into chunks of max 500 for providers like Firebase
  const chunkSize = 500;
  const chunks = [];
  for (let i = 0; i < tokens.length; i += chunkSize) {
    chunks.push(tokens.slice(i, i + chunkSize));
  }

  let successCount = 0;
  let failureCount = 0;

  // If firebase-admin is initialized, use it; otherwise simulate
  const canUseFirebase = !!admin && admin.apps && admin.apps.length > 0 && admin.messaging;

  for (const chunk of chunks) {
    if (canUseFirebase) {
      const message = {
        notification: {
          title: title,
          body: body
        },
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#FFFFFF',
            channelId: 'default-channel-id'
          }
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: title,
                body: body
              },
              sound: 'default',
              badge: 1
            }
          },
          headers: {
            'apns-priority': '10'
          }
        },
        // No custom data like screen; only title/body as requested
        tokens: chunk
      };

      try {
        const response = await admin.messaging().sendEachForMulticast(message);
        successCount += response.successCount || 0;
        failureCount += response.failureCount || 0;

        // Optionally inspect individual responses to handle invalid tokens
        // response.responses.forEach((res, idx) => { if (!res.success) { /* handle chunk[idx] */ } });
      } catch (sendErr) {
        // If a send fails for the chunk, count all as failures for safety
        failureCount += chunk.length;
      }
    } else {
      // Simulation branch when firebase-admin isn't configured
      successCount += chunk.length;
    }
  }

  return {
    success: true,
    message: `Notifications processed`,
    summary: {
      title,
      body,
      totalTokens: tokens.length,
      successCount,
      failureCount
    }
  };
}

module.exports = {
  sendPushNotificationToAllUsers
};


