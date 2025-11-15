const express = require('express');
const serviceRequestController = require('../controllers/serviceRequestController');

const router = express.Router();

// POST /api/service-requests - Get service requests
router.post('/my-requests', serviceRequestController.getServiceRequests);

module.exports = router;

