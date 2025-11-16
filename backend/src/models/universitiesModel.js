const pool = require('../db/mysql');

async function getAllUniversities() {
  const [rows] = await pool.query('SELECT uid, name, theme FROM universities');
  return rows;
}

module.exports = { getAllUniversities };

