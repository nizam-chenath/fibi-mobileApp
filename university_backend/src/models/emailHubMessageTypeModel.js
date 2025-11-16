const pool = require('../db/mysql');

/**
 * Get all message types (notification type descriptions) for a specific person
 * Joins notification_log with notification_log_recipient, person, and notification_type tables
 */
async function getAllMessageTypesForPerson(personId) {
  try {
    const query = `
      SELECT DISTINCT
        nt.DESCRIPTION as message_type,
        nt.NOTIFICATION_TYPE_ID
      FROM notification_log nl
      INNER JOIN notification_log_recipient nlr ON nl.NOTIFICATION_LOG_ID = nlr.NOTIFICATION_LOG_ID
      INNER JOIN person p ON nlr.TO_USER_EMAIL_ID = p.EMAIL_ADDRESS
      INNER JOIN notification_type nt ON nl.NOTIFICATION_TYPE_ID = nt.NOTIFICATION_TYPE_ID
      WHERE p.PERSON_ID = ? AND nl.IS_SUCCESS = 'Y'
      ORDER BY nt.DESCRIPTION ASC
    `;

    const [rows] = await pool.query(query, [personId]);
    return rows;
  } catch (error) {
    console.error('Error in getAllMessageTypesForPerson:', error);
    throw error;
  }
}

module.exports = {
  getAllMessageTypesForPerson
};

