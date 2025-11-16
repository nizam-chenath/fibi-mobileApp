const pool = require('../db/mysql');

/**
 * Insert or update a user's FCM data in users table.
 * Uses columns: person_id, person_name, fcm_token, uid, created_at, updated_at
 */
async function upsertUserFcm(personId, personName, fcmToken, uid = null) {
  if (!personId) {
    throw new Error('person_id is required');
  }

  // Insert/Update into users with the specified column names
  const upsertSql = `
    INSERT INTO users (person_id, person_name, fcm_tocken, uid, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      person_id = VALUES(person_id),
      person_name = VALUES(person_name),
      fcm_tocken = VALUES(fcm_tocken),
      uid = VALUES(uid),
      updated_at = NOW()
  `;

  try {
    const [result] = await pool.query(
      upsertSql,
      [personId, personName || null, fcmToken || null, uid || null]
    );
    return { affectedRows: result.affectedRows, insertedId: result.insertId || null, usedFcmTokenColumn: true };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  upsertUserFcm
};


