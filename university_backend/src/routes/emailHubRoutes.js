const express = require('express');
const emailHubController = require('../controllers/emailHubController');

const router = express.Router();

// GET or POST /api/email-hub - Get email hub entries for a person
router.post('/my-notifications', emailHubController.getEmailHub);

module.exports = router;

