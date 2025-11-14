// deleteRoutes.js
const express = require('express');
const deleteController = require('../controllers/deleteController');

const router = express.Router();

router.delete('/:id', deleteController.deleteEntry);

module.exports = router;
