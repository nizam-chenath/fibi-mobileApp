const { sendPushNotificationToAllUsers } = require('../models/pushNotificationModel');

exports.broadcastMessage = async (req, res) => {
  try {
    const { title, body } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Only title and body are used for sending notifications
    const result = await sendPushNotificationToAllUsers(title, body);

    return res.status(200).json({
      message: 'Broadcast sent successfully',
      result
    });
  } catch (error) {
    console.error('Failed to send broadcast:', error);
    return res.status(500).json({ error: 'Failed to send broadcast' });
  }
};


