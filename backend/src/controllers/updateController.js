const bcrypt = require('bcryptjs');

const {
  findUserByEmployeeId,
  findUserById,
  updateUserByEmployeeId
} = require('../models/userModel');

const updateDetails = async (req, res) => {
  const employeeId = req.params.id;
  const updates = { ...req.body };

  if (!employeeId) {
    return res.status(400).send('Employee ID is required');
  }

  try {
    const employee =
      (await findUserByEmployeeId(employeeId)) ||
      (await findUserById(employeeId));

    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    if (updates.employeeId && updates.employeeId !== employee.employeeId) {
      const conflict = await findUserByEmployeeId(updates.employeeId);
      if (conflict) {
        return res
          .status(409)
          .send('Another user already uses the provided employee ID');
      }
    }

    if (updates.new_password) {
      const hash = await bcrypt.hash(updates.new_password, 10);
      updates.password = hash;
      updates.is_loggedIn = 'Y';
      delete updates.new_password;
    }

    updates.updatedDate = new Date().toLocaleString().replace(/,/g, '');

    const success = await updateUserByEmployeeId(employee.employeeId, updates);

    if (!success) {
      return res.status(500).send('Unable to update employee details');
    }

    console.log('Employee details updated in MySQL');
    return res.status(200).send('Employee details updated successfully');
  } catch (error) {
    console.error('Error updating employee details in MySQL:', error);
    return res.status(500).send('Error updating employee details');
  }
};

module.exports = { updateDetails };
