const { getAllUsers } = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    if (!users.length) {
      return res.status(404).send('Details not found');
    }

    const detailsList = users.map((user) => ({
      profile_pic: user.profile_pic,
      first_name: user.first_name,
      last_name: user.last_name,
      seat_allocation: user.seat_allocation,
      employeeId: user.employeeId,
      email: user.email,
      contact_no: user.contact_no,
      role: user.role,
      access_type: user.access_type,
      is_active: user.is_active,
      is_delete: user.is_delete,
      registrationDate: user.createdDate,
      lastUpdatedDate: user.updatedDate,
      password: user.password
    }));

    return res.status(200).send(detailsList);
  } catch (error) {
    console.error('Error fetching details from MySQL:', error);
    return res.status(500).send('Error fetching details');
  }
};

module.exports = { getUsers };