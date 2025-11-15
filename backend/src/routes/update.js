// updateRoutes.js
const express = require('express');
const updateController = require('../controllers/updateController');

const router = express.Router();

router.post('/:id', updateController.updateDetails);

module.exports = router;
