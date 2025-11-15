// userDetailsRoutes.js
const express = require('express');
const userDetailsController = require('../controllers/userDetailsController');

const router = express.Router();

router.get('/:id', userDetailsController.getDetails);

module.exports = router;
