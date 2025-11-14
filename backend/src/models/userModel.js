const pool = require('../db/mysql');
const https = require('https');
const http = require('http');

const USER_SELECT_FIELDS = [
  'id',
  'first_name',
  'last_name',
  'employee_id',
  'username',
  'email',
  'contact_no',
  'seat_allocation',
  'profile_pic',
  'password',
  'role',
  'joining_date',
  'access_type',
  'is_active',
  'is_delete',
  'is_logged_in',
  'created_date',
  'updated_date'
];

function formatTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function mapUserRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    employeeId: row.employee_id,
    email: row.email,
    contact_no: row.contact_no,
    seat_allocation: row.seat_allocation,
    profile_pic: row.profile_pic,
    password: row.password,
    role: row.role,
    joining_date: row.joining_date,
    access_type: row.access_type,
    is_active: row.is_active,
    is_delete: row.is_delete,
    is_loggedIn: row.is_logged_in,
    createdDate: row.created_date,
    updatedDate: row.updated_date
  };
}

async function findUserByEmployeeId(employeeId) {
  const [rows] = await pool.query(
    `SELECT ${USER_SELECT_FIELDS.join(', ')} FROM users WHERE employee_id = ? LIMIT 1`,
    [employeeId]
  );

  return rows.length > 0 ? mapUserRow(rows[0]) : null;
}

async function findUserByUsername(username, university) {
  if (!university) {
    console.log('University not provided for findUserByUsername');
    return null;
  }

  if (!university.ip) {
    console.log('University IP not found');
    return null;
  }

  // Call external API at university.ip/api/findUser
  return new Promise((resolve) => {
    try {
      // Handle IP address or full URL
      let baseUrl = university.ip.trim();
      
      // Check if it's already a full URL with protocol
      const hasProtocol = baseUrl.startsWith('http://') || baseUrl.startsWith('https://');
      
      if (!hasProtocol) {
        // If no protocol, assume it's an IP address or domain and add https://
        baseUrl = `https://${baseUrl}`;
      }
      
      // Remove trailing slash if present to avoid double slashes
      baseUrl = baseUrl.replace(/\/$/, '');
      
      // Construct the full API endpoint URL
      const fullApiUrl = `${baseUrl}/api/users/findUser`;
      
      console.log(`Calling external API: ${fullApiUrl}`);
      
      // Parse the full URL - this works for any hosted URL like https://fibi-mobileapp-cgeh.onrender.com
      const url = new URL(fullApiUrl);
      const isHttps = url.protocol === 'https:';
      const httpModule = isHttps ? https : http;

      const postData = JSON.stringify({ username });

      // Build path with search params if any
      let path = url.pathname;
      if (url.search) {
        path += url.search;
      }

      const options = {
        hostname: url.hostname, // This correctly extracts hostname from any URL format
        port: url.port || (isHttps ? 443 : 80),
        path: path, // Include pathname and any query parameters
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = httpModule.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const userData = JSON.parse(data);
              resolve(userData);
            } else {
              console.log(`API call failed with status ${res.statusCode}: ${data}`);
              resolve(null);
            }
          } catch (error) {
            console.error('Error parsing API response:', error);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error calling external API:', error);
        resolve(null);
      });

      // Set timeout
      req.setTimeout(10000, () => {
        console.error('API call timeout');
        req.destroy();
        resolve(null);
      });

      req.write(postData);
      req.end();
    } catch (error) {
      console.error('Error setting up API request:', error);
      resolve(null);
    }
  });
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT ${USER_SELECT_FIELDS.join(', ')} FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows.length > 0 ? mapUserRow(rows[0]) : null;
}

async function createUser(user) {
  const now = formatTimestamp();

  const payload = {
    first_name: user.first_name ?? null,
    last_name: user.last_name ?? null,
    employee_id: user.employeeId,
    email: user.email ?? null,
    contact_no: user.contact_no ?? null,
    seat_allocation: user.seat_allocation ?? null,
    profile_pic: user.profile_pic ?? null,
    password: user.password,
    role: user.role ?? null,
    joining_date: user.joining_date ?? null,
    access_type: user.access_type ?? null,
    is_active: user.is_active ?? 'Y',
    is_delete: user.is_delete ?? 'N',
    is_logged_in: user.is_loggedIn ?? 'N',
    created_date: user.createdDate ?? now,
    updated_date: user.updatedDate ?? now
  };

  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map(() => '?').join(', ');

  const [result] = await pool.query(
    `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders})`,
    values
  );

  return result.insertId;
}

async function updateUserByEmployeeId(employeeId, updates) {
  const now = formatTimestamp();
  const columnMap = {
    first_name: 'first_name',
    last_name: 'last_name',
    employeeId: 'employee_id',
    email: 'email',
    contact_no: 'contact_no',
    seat_allocation: 'seat_allocation',
    profile_pic: 'profile_pic',
    role: 'role',
    joining_date: 'joining_date',
    access_type: 'access_type',
    is_active: 'is_active',
    is_delete: 'is_delete',
    is_loggedIn: 'is_logged_in',
    password: 'password'
  };

  const setClauses = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    const column = columnMap[key];
    if (column !== undefined) {
      setClauses.push(`${column} = ?`);
      values.push(value);
    }
  });

  setClauses.push('updated_date = ?');
  values.push(now, employeeId);

  const [result] = await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE employee_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteUserByEmployeeId(employeeId) {
  const [result] = await pool.query('DELETE FROM users WHERE employee_id = ?', [
    employeeId
  ]);

  return result.affectedRows > 0;
}

async function getAllUsers() {
  const [rows] = await pool.query(
    `SELECT ${USER_SELECT_FIELDS.join(', ')} FROM users ORDER BY first_name ASC`
  );

  return rows.map(mapUserRow);
}

async function setLoggedInStatus(employeeId, status) {
  return updateUserByEmployeeId(employeeId, { is_loggedIn: status });
}

async function findUserUniversity(uid) {
  const [rows] = await pool.query(
    'SELECT * FROM universities WHERE uid = ? LIMIT 1',
    [uid]
  );

  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  findUserByEmployeeId,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserByEmployeeId,
  deleteUserByEmployeeId,
  getAllUsers,
  setLoggedInStatus,
  findUserUniversity
};