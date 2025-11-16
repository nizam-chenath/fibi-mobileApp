const express = require('express');
const emailHubMessageTypeController = require('../controllers/emailHubMessageTypeController');

const router = express.Router();

// POST /api/email-hub/message-types - Get all message types for a person
router.post('/my-message-types', emailHubMessageTypeController.getMessageTypes);

module.exports = router;

