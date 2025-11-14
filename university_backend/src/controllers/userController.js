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

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user from MySQL:', error);
    return res.status(500).json({ message: 'Error fetching user' });
  }
};

module.exports = { findUser: findUserHandler };

