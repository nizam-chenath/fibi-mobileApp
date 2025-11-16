const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// POST /api/notifications - Send notification via WebSocket
router.post('/new-entry', notificationController.sendNotification);

module.exports = router;

