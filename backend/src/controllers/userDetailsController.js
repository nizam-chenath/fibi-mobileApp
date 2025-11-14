const {
  findUserByEmployeeId,
  findUserById
} = require('../models/userModel');

const getDetails = async (req, res) => {
  const employeeId = req.params.id;

  if (!employeeId) {
    return res.status(400).send('Employee ID is required');
  }

  try {
    const user =
      (await findUserByEmployeeId(employeeId)) ||
      (await findUserById(employeeId));

    if (!user) {
      return res.status(404).send('Details not found');
    }

    const details = {
      first_name: user.first_name,
      last_name: user.last_name,
      employeeId: user.employeeId,
      email: user.email,
      contact_no: user.contact_no,
      seat_allocation: user.seat_allocation,
      profile_pic: user.profile_pic,
      role: user.role,
      joining_date: user.joining_date,
      access_type: user.access_type,
      is_loggedIn: user.is_loggedIn,
      is_active: user.is_active,
      is_delete: user.is_delete,
      registrationDate: user.createdDate,
      lastUpdatedDate: user.updatedDate,
      password: user.password
    };

    return res.status(200).send(details);
  } catch (error) {
    console.error('Error fetching details from MySQL:', error);
    return res.status(500).send('Error fetching details');
  }
};

module.exports = { getDetails };
