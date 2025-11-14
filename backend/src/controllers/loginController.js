require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  findUserByUsername,
  findUserUniversity,
  setLoggedInStatus
} = require('../models/userModel');

const login = async (req, res) => {
  const { uid, username, password } = req.body;

  if (!uid || !username || !password) {
    return res
      .status(400)
      .json({ message: 'UID, username, and password are required' });
  }

  try {
    // First, find the university based on uid
    const university = await findUserUniversity(uid);

    if (!university) {
      return res
        .status(404)
        .json({ message: 'University not found' });
    }

    // Then, find the user by username with university parameter
    const existingUser = await findUserByUsername(username, university);

    if (!existingUser || !existingUser.password) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign(
      { userId: existingUser.id, employeeId: existingUser.employeeId, universityId: university.uid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    if (existingUser.is_loggedIn !== 'Y') {
      await setLoggedInStatus(existingUser.employeeId, 'Y');
    }

    return res
      .status(200)
      .json({ 
        message: 'User successfully logged in', 
        accessToken,
        university: university
      });
  } catch (error) {
    console.error('Error querying MySQL:', error);
    return res.status(500).send('Error querying MySQL');
  }
};

module.exports = { login };