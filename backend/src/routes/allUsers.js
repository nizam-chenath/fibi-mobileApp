// allUsers.js
const express = require('express');
const allUsersController = require('../controllers/allUsersController');

const router = express.Router();

router.get('/', allUsersController.getUsers);

module.exports = router;
