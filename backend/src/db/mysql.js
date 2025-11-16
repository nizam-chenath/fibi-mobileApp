const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool with better error handling
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000 // 10 seconds connection timeout
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to MySQL...');
  }
});

// Convert pool to promise pool for async/await support
const promisePool = pool.promise();

// Test connection with retry logic
async function testConnection() {
  try {
    const connection = await promisePool.getConnection();
    console.log('Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL Database:', err);
    if (err.code === 'ETIMEDOUT') {
      console.error('Connection timeout - check your DB_HOST, DB_PORT, and network connectivity');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Connection refused - is MySQL server running?');
    }
    // Retry after 2 seconds
    setTimeout(testConnection, 2000);
  }
}

testConnection();

module.exports = promisePool;
