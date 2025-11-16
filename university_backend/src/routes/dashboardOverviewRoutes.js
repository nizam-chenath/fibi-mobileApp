const express = require('express');
const dashboardOverviewController = require('../controllers/dashboardOverviewController');

const router = express.Router();

// POST /api/dashboard-overview/research-summary-table - Get research summary table data
router.post('/research-summary-table', dashboardOverviewController.RESEARCH_SUMMARY_TABLE);

module.exports = router;

