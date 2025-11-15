const express = require('express');
const serviceRequestController = require('../controllers/serviceRequestController');

const router = express.Router();

// POST /api/service-requests/my-requests - Get service requests by uid
router.post('/my-requests', serviceRequestController.getServiceRequests);

module.exports = router;

