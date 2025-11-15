const pool = require('../db/mysql');

async function findUser(username) {
  try {
    
    const [rows] = await pool.query(
      'SELECT * FROM person WHERE USER_NAME = ? LIMIT 1',
      [username]
    );
 

    if (rows.length > 0) {
      console.log("Return user data");
      return rows;
    }

    console.log("No rows found, returning null");
    return null;
  } catch (error) {
    console.error('Error in findUser query:', error);
    throw error;
  }
}

module.exports = {
  findUser
};
