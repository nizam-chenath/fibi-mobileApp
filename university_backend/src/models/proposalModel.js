const pool = require('../db/mysql');

async function getProposalsByUserName(userName) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM proposal WHERE CREATE_USER = ?',
      [userName]
    );

    return rows;
  } catch (error) {
    console.error('Error in getProposalsByUserName query:', error);
    throw error;
  }
}

module.exports = {
  getProposalsByUserName
};

