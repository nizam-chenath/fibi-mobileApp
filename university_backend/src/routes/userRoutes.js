// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/findUser', userController.findUser);

module.exports = router;

