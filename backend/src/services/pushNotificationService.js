const { sendPushNotificationToAllUsers } = require('../models/pushNotificationModel');

/**
 * Broadcast a push notification to all users.
 * Only requires title and body.
 */
const broadcastMessage = async ({ title, body }) => {
  try {
    console.log('Broadcasting Message:', title, body);

    if (!title || !body) {
      throw new Error('Title and body are required');
    }

    const result = await sendPushNotificationToAllUsers(title, body);

    console.log('Broadcast sent successfully:', result);
    return {
      message: 'Broadcast sent successfully',
      result
    };
  } catch (error) {
    console.error('❌ Failed to send broadcast:', error);
    throw error;
  }
};

module.exports = { broadcastMessage };


