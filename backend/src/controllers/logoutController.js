const {
  findUserByEmployeeId,
  findUserById,
  setLoggedInStatus
} = require('../models/userModel');

const logout = async (req, res) => {
  const { employeeId, id } = req.body;
  const identifier = employeeId || id;

  if (!identifier) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    const existingUser =
      (employeeId && (await findUserByEmployeeId(identifier))) ||
      (await findUserById(identifier)) ||
      (await findUserByEmployeeId(identifier));

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await setLoggedInStatus(existingUser.employeeId, 'N');

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error updating MySQL:', error);
    return res.status(500).send('Error updating MySQL');
  }
};

module.exports = { logout };