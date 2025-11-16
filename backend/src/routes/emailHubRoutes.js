const express = require('express');
const emailHubController = require('../controllers/emailHubController');

const router = express.Router();

// POST /api/email-hub/my-notifications - Get email hub entries by uid and person_id
router.post('/my-notifications', emailHubController.getEmailHub);

// POST /api/email-hub/my-message-types - Get all message types for a person
router.post('/my-message-types', emailHubController.getMessageTypes);

module.exports = router;

