const pool = require('../db/mysql');

async function findUser(username) {
  const [rows] = await pool.query(
    'SELECT * FROM person WHERE USER_NAME = ? LIMIT 1',
    [username]
  );

  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  findUser
};
