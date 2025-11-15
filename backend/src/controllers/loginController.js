require('dotenv').config();

const {
  findUserUniversity,
  callExternalLoginApi
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

    // Get base URL from university or use default
    // Default to localhost:5000 (university_backend default port)
    const baseUrl = university.ip || 'http://localhost:5000';
    //const baseUrl = 'http://localhost:5005';

    // Call external login API with username and password
    console.log(`Calling external login API at: ${baseUrl}/api/login`);
    const loginResult = await callExternalLoginApi(baseUrl, username, password);

    console.log('Login result:', loginResult);

    if (!loginResult || !loginResult.data) {
      // Check if it's a 404 error (endpoint not found)
      if (baseUrl.includes('onrender.com') || baseUrl.includes('render.com')) {
        return res.status(503).json({ 
          message: 'External API endpoint not found. Please verify the university backend server URL is correct.',
          hint: 'The university backend server should be running separately, not on the main backend server.'
        });
      }
      return res
        .status(401)
        .json({ message: 'Invalid username or password, or external API is unavailable' });
    }

    // Set cookies from external API response
    if (loginResult.cookies && loginResult.cookies.length > 0) {
      loginResult.cookies.forEach(cookieString => {
        // Parse cookie string and set it
        const cookieParts = cookieString.split(';');
        const [nameValue] = cookieParts;
        const [name, value] = nameValue.split('=');
        
        // Extract cookie options
        const cookieOptions = {
          httpOnly: cookieString.includes('HttpOnly'),
          secure: cookieString.includes('Secure') || process.env.NODE_ENV === 'production',
          sameSite: cookieString.includes('SameSite=Strict') ? 'strict' : 
                   cookieString.includes('SameSite=Lax') ? 'lax' : 'lax'
        };

        // Extract maxAge if present
        const maxAgeMatch = cookieString.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) {
          cookieOptions.maxAge = parseInt(maxAgeMatch[1]) * 1000; // Convert to milliseconds
        }

        res.cookie(name.trim(), value.trim(), cookieOptions);
      });
    }

    // Return user details from external API response
    return res
      .status(200)
      .json({ 
        message: 'User successfully logged in',
        user: loginResult.data.user || loginResult.data
      });
  } catch (error) {
    console.error('Error in login:', error);
    
    // Provide more specific error messages
    if (error.code === 'ECONNRESET') {
      return res.status(503).json({ 
        message: 'Connection reset. The external server closed the connection unexpectedly. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Connection refused. The external server may not be running. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ETIMEDOUT' || (error.message && error.message.includes('timeout'))) {
      return res.status(504).json({ 
        message: 'Request timeout. The external server may be unavailable. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ 
        message: 'Database connection error. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { login };