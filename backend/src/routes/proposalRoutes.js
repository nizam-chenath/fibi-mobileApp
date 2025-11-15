const express = require('express');
const proposalController = require('../controllers/proposalController');

const router = express.Router();

// POST /api/proposals - Get proposals by uid
router.post('/', proposalController.getProposals);

module.exports = router;

