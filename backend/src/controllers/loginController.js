require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

    console.log("existingUser GOT IT", existingUser);
    console.log('User found from external API:', existingUser ? 'Yes' : 'No');

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password - user not found' });
    }

    // Normalize field names - check for different password field names (now lowercase after conversion)
    const storedPassword = existingUser.password;
    const userId = existingUser.person_id;

    if (!storedPassword) {
      console.error('User found but no password field found. Available fields:', Object.keys(existingUser));
      return res
        .status(401)
        .json({ message: 'Invalid username or password - password field missing' });
    }

    // Create normalized user object
    const normalizedUser = {
      ...existingUser,
      password: storedPassword,
      id: userId,
      last_name: existingUser.last_name,
      first_name: existingUser.first_name,
      middle_name: existingUser.middle_name,
      full_name: existingUser.full_name,
      user_name: existingUser.user_name,
    };
  console.log("password", password);
  console.log("storedPassword", storedPassword);
   
    // Hash the password from req.body and compare with stored password
    // The stored password appears to be base64-encoded (e.g., iu/x28O5TPE887xsIXPLmdAxKZI=)
    let passwordMatch = false;
    
    // Check if stored password is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
      // Stored password is a bcrypt hash, use bcrypt.compare
      passwordMatch = await bcrypt.compare(password, storedPassword);
      console.log('Compared using bcrypt.compare (stored password is bcrypt hash)');
    } else {
      // Stored password appears to be base64-encoded hash (MD5, SHA1, or SHA256)
      // Try different hashing algorithms and compare
      
      // Try MD5 (base64 encoded)
      const md5Hash = crypto.createHash('md5').update(password).digest('base64');
      console.log('MD5 hash (base64):', md5Hash);
      passwordMatch = (md5Hash === storedPassword);
      
      if (!passwordMatch) {
        // Try SHA1 (base64 encoded)
        const sha1Hash = crypto.createHash('sha1').update(password).digest('base64');
        console.log('SHA1 hash (base64):', sha1Hash);
        passwordMatch = (sha1Hash === storedPassword);
      }
      
      if (!passwordMatch) {
        // Try SHA256 (base64 encoded)
        const sha256Hash = crypto.createHash('sha256').update(password).digest('base64');
        console.log('SHA256 hash (base64):', sha256Hash);
        passwordMatch = (sha256Hash === storedPassword);
      }
      
      if (!passwordMatch) {
        // Try plain text comparison as fallback
        passwordMatch = (password === storedPassword);
        console.log('Tried plain text comparison');
      }
      
      console.log('Password match result:', passwordMatch);
    }

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign(
      { userId: normalizedUser.id, universityId: uid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // Update login status, but don't fail login if this fails
    if (normalizedUser.is_loggedIn !== 'Y' && normalizedUser.employeeId) {
      try {
        await setLoggedInStatus(normalizedUser.employeeId, 'Y');
      } catch (statusError) {
        console.error('Error updating login status (non-critical):', statusError);
        // Continue with login even if status update fails
      }
    }

    return res
      .status(200)
      .json({ 
        message: 'User successfully logged in', 
        accessToken,
        user:{
          id: normalizedUser.id,
          last_name: normalizedUser.last_name,
          first_name: normalizedUser.first_name,
          middle_name: normalizedUser.middle_name,
          full_name: normalizedUser.full_name,
          user_name: normalizedUser.user_name,
        }
      });
  } catch (error) {
    console.error('Error in login:', error);
    
    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ 
        message: 'Database connection error. Please try again.' 
      });
    }
    
    if (error.message && error.message.includes('timeout')) {
      return res.status(504).json({ 
        message: 'Request timeout. The university server may be unavailable.' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { login };