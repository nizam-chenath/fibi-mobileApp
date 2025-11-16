const pool = require('../db/mysql');

/**
 * Get email hub entries for a specific person with pagination and filtering
 * Joins notification_log with notification_log_recipient, person, and notification_type tables
 */
async function getEmailHubEntries(personId, options = {}) {
  try {
    const {
      currentPage = 1,
      pageNumber = 20,
      sortBy = 'SEND_DATE',
      message_type = null // Filter by notification type description
    } = options;

    // Calculate pagination
    const offset = (currentPage - 1) * pageNumber;
    const limit = pageNumber;

    // Build WHERE clause
    let whereClause = 'p.PERSON_ID = ? AND nl.IS_SUCCESS = ?';
    const params = [personId, 'Y'];

    // Add message_type filter if provided
    // If message_type is null or empty, fetch all message_type data (no filter applied)
    if (message_type && message_type.trim() !== '') {
      whereClause += ' AND nt.DESCRIPTION LIKE ?';
      params.push(`%${message_type.trim()}%`);
    }

    // Build ORDER BY clause based on sortBy
    let orderByClause = 'nl.SEND_DATE DESC'; // Default
    if (sortBy === 'SEND_DATE' || sortBy === 'sendDate') {
      orderByClause = 'nl.SEND_DATE DESC';
    }

    const query = `
      SELECT 
        nl.NOTIFICATION_LOG_ID,
        nl.NOTIFICATION_TYPE_ID,
        nl.FROM_USER_EMAIL_ID,
        nl.SUBJECT,
        nl.MESSAGE,
        nl.SEND_DATE,
        nlr.TO_USER_EMAIL_ID,
        p.PERSON_ID,
        nt.DESCRIPTION as message_type
      FROM notification_log nl
      INNER JOIN notification_log_recipient nlr ON nl.NOTIFICATION_LOG_ID = nlr.NOTIFICATION_LOG_ID
      INNER JOIN person p ON nlr.TO_USER_EMAIL_ID = p.EMAIL_ADDRESS
      INNER JOIN notification_type nt ON nl.NOTIFICATION_TYPE_ID = nt.NOTIFICATION_TYPE_ID
      WHERE ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    // Get total count for pagination info
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notification_log nl
      INNER JOIN notification_log_recipient nlr ON nl.NOTIFICATION_LOG_ID = nlr.NOTIFICATION_LOG_ID
      INNER JOIN person p ON nlr.TO_USER_EMAIL_ID = p.EMAIL_ADDRESS
      INNER JOIN notification_type nt ON nl.NOTIFICATION_TYPE_ID = nt.NOTIFICATION_TYPE_ID
      WHERE ${whereClause}
    `;

    const countParams = [personId, 'Y'];
    if (message_type && message_type.trim() !== '') {
      countParams.push(`%${message_type.trim()}%`);
    }

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return {
      entries: rows,
      pagination: {
        currentPage: parseInt(currentPage),
        pageNumber: parseInt(pageNumber),
        total: total,
        totalPages: Math.ceil(total / pageNumber)
      }
    };
  } catch (error) {
    console.error('Error in getEmailHubEntries:', error);
    throw error;
  }
}

module.exports = {
  getEmailHubEntries
};

