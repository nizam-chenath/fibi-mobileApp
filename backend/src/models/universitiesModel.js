const pool = require('../db/mysql');

async function getAllUniversities() {
  const [rows] = await pool.query('SELECT uid, name FROM universities');
  return rows;
}

module.exports = { getAllUniversities };

