// proposalRoutes.js
const express = require('express');
const proposalController = require('../controllers/proposalController');

const router = express.Router();

router.post('/my-proporsals', proposalController.getProposals);

module.exports = router;

