const { getAllUniversities } = require('../models/universitiesModel');

const fetchUniversities = async (req, res) => {
  try {
    const universities = await getAllUniversities();
    return res.status(200).json(universities);
  } catch (error) {
    console.error('Error fetching universities from MySQL:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching universities' });
  }
};

module.exports = { fetchUniversities };

