const express = require('express');
const { saveUserFcm } = require('../controllers/userFcmController');

const router = express.Router();

// POST /api/user-fcm - Save or update user's FCM data
router.post('/create-details', saveUserFcm);

module.exports = router;


