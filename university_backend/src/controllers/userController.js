const { findUser } = require('../models/userModel');

const findUserHandler = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await findUser(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Returning user data. Fields:', Object.keys(user));
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user from MySQL:', error);
    
    // Provide more specific error messages
    if (error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please check your database configuration.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Database connection refused. Is MySQL server running?',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { findUser: findUserHandler };

