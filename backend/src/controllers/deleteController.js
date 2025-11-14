const {
  deleteUserByEmployeeId,
  findUserByEmployeeId
} = require('../models/userModel');

const deleteEntry = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const employee = await findUserByEmployeeId(employeeId);

    if (!employee) {
      return res.status(404).send('Employee entry not found');
    }

    await deleteUserByEmployeeId(employeeId);
    console.log('Employee entry deleted from MySQL');
    return res.status(200).send('Employee entry deleted successfully');
  } catch (error) {
    console.error('Error deleting employee entry from MySQL:', error);
    return res.status(500).send('Error deleting employee entry from MySQL');
  }
};

module.exports = { deleteEntry };
