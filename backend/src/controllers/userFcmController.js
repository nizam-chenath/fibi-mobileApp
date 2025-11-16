const { upsertUserFcm } = require('../models/userFcmModel');

const saveUserFcm = async (req, res) => {
  try {
    const { person_id, person_name, fcm_token, uid } = req.body || {};

    if (!person_id) {
      return res.status(400).json({ message: 'person_id is required' });
    }
    if (!fcm_token) {
      return res.status(400).json({ message: 'fcm_token is required' });
    }

    const result = await upsertUserFcm(person_id, person_name || null, fcm_token, uid || null);

    return res.status(200).json({
      message: 'FCM data saved successfully',
      person_id,
      person_name: person_name || null,
      uid: uid || null,
      usedFcmTokenColumn: result.usedFcmTokenColumn === true
    });
  } catch (error) {
    console.error('Error saving user FCM data:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ message: 'Users table not found in database' });
    }
    return res.status(500).json({
      message: 'Error saving user FCM data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { saveUserFcm };


