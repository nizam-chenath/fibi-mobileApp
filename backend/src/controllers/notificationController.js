const { sendToRoom } = require('../utils/socket');

// Common room name for all notifications
const COMMON_ROOM_NAME = 'notifications-room';
const NOTIFICATION_EVENT = 'notification';

/**
 * Handle notification request
 * If req.body has data, send it via WebSocket to frontend through common room
 */
const sendNotification = async (req, res) => {
  try {
    // Check if req.body exists and has data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        message: 'Request body is required and must contain data' 
      });
    }

    // Prepare notification data - send all data from req.body
    const notificationData = {
      ...req.body,
      timestamp: new Date().toISOString()
    };
    console.log("notificationData", req.body);
    

    // Send notification via WebSocket to the common room
    const sent = sendToRoom(COMMON_ROOM_NAME, NOTIFICATION_EVENT, notificationData);

    if (sent) {
      return res.status(200).json({
        message: 'Notification sent successfully',
        roomId: COMMON_ROOM_NAME,
        event: NOTIFICATION_EVENT,
        data: notificationData
      });
    } else {
      return res.status(500).json({
        message: 'Failed to send notification - Socket.IO not initialized'
      });
    }
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return res.status(500).json({
      message: 'Error sending notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { sendNotification };

