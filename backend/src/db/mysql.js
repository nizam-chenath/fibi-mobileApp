const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,       // adjust as needed
  queueLimit: 0
});

// Convert pool to promise pool for async/await support
const promisePool = pool.promise();

// Test connection
promisePool
  .getConnection()
  .then((connection) => {
    console.log('Connected to MySQL Database');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to MySQL Database:', err);
  });

module.exports = promisePool;
