const express = require('express');
const { fetchUniversities } = require('../controllers/universitiesController');

const router = express.Router();

router.get('/all-universities', fetchUniversities);

module.exports = router;

