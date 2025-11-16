const pool = require('../db/mysql');

/**
 * Get new inbox entries that haven't been processed yet
 * This function checks for entries based on UPDATE_TIMESTAMP
 * Joins with message table to get notification_title based on MESSAGE_TYPE_CODE
 */
async function getNewInboxEntries(lastProcessedTimestamp = null) {
  try {
    let query;
    let params;

    // Base SELECT with joins
    const selectFields = `
      inbox.TO_PERSON_ID,
      inbox.USER_MESSAGE,
      inbox.MESSAGE_TYPE_CODE,
      inbox.MODULE_CODE,
      message.DESCRIPTION as notification_title,
      coeus_module.DESCRIPTION as module_description,
      inbox.UPDATE_TIMESTAMP,
      COALESCE(inbox.INBOX_ID) as inbox_id
    `;

    const joins = `
      LEFT JOIN message ON inbox.MESSAGE_TYPE_CODE = message.MESSAGE_TYPE_CODE
      LEFT JOIN coeus_module ON inbox.MODULE_CODE = coeus_module.MODULE_CODE
    `;

    if (lastProcessedTimestamp) {
      // Get entries with UPDATE_TIMESTAMP greater than the last processed timestamp
      query = `
        SELECT ${selectFields}
        FROM inbox
        ${joins}
        WHERE (
          inbox.UPDATE_TIMESTAMP > ?
          OR inbox.update_timestamp > ?
        )
        ORDER BY COALESCE(inbox.UPDATE_TIMESTAMP, inbox.update_timestamp) ASC
      `;
      params = [lastProcessedTimestamp, lastProcessedTimestamp];
    } else {
      // First run - get all entries from the last 24 hours based on UPDATE_TIMESTAMP
      query = `
        SELECT ${selectFields}
        FROM inbox
        ${joins}
        WHERE (
          inbox.UPDATE_TIMESTAMP >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        )
        ORDER BY COALESCE(inbox.UPDATE_TIMESTAMP) ASC
        LIMIT 100
      `;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    // Handle timeout errors gracefully - return empty array instead of throwing
    if (error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
      console.warn('Database connection timeout or error in getNewInboxEntries, returning empty array:', error.code);
      return []; // Return empty array to allow cron job to continue
    }
    
    console.error('Error in getNewInboxEntries:', error);
    // If the query fails, try a simpler query
    if (lastProcessedTimestamp) {
      try {
        const simpleQuery = `
          SELECT 
            inbox.TO_PERSON_ID,
            inbox.USER_MESSAGE,
            inbox.MESSAGE_TYPE_CODE,
            inbox.MODULE_CODE,
            message.DESCRIPTION as notification_title,
            coeus_module.DESCRIPTION as module_description,
            inbox.UPDATE_TIMESTAMP,
            inbox.INBOX_ID as inbox_id
          FROM inbox
          LEFT JOIN message ON inbox.MESSAGE_TYPE_CODE = message.MESSAGE_TYPE_CODE
          LEFT JOIN coeus_module ON inbox.MODULE_CODE = coeus_module.MODULE_CODE
          WHERE inbox.UPDATE_TIMESTAMP > ?
          ORDER BY inbox.UPDATE_TIMESTAMP ASC
          LIMIT 100
        `;
        const [simpleRows] = await pool.query(simpleQuery, [lastProcessedTimestamp]);
        return simpleRows;
      } catch (simpleError) {
        // Handle timeout in simple query too
        if (simpleError.code === 'ETIMEDOUT' || simpleError.code === 'PROTOCOL_CONNECTION_LOST' || simpleError.code === 'ECONNREFUSED') {
          console.warn('Database connection timeout in simple query, returning empty array:', simpleError.code);
          return [];
        }
        console.error('Error in simple inbox query:', simpleError);
        // Return empty array instead of throwing to prevent cron job from crashing
        return [];
      }
    }
    // Return empty array instead of throwing to prevent cron job from crashing
    return [];
  }
}

/**
 * Get the maximum UPDATE_TIMESTAMP from inbox table to track the last processed entry
 */
async function getMaxInboxTimestamp() {
  try {
    const query = 'SELECT MAX(UPDATE_TIMESTAMP) as maxTimestamp FROM inbox';
    const [rows] = await pool.query(query);
    
    if (rows[0]?.maxTimestamp !== null && rows[0]?.maxTimestamp !== undefined) {
      return rows[0].maxTimestamp;
    }

    // If no timestamp found, return null (will process entries from last 24 hours)
    console.warn('Could not determine max inbox timestamp, will process entries from last 24 hours');
    return null;
  } catch (error) {
    console.error('Error in getMaxInboxTimestamp:', error);
    return null; // Return null instead of throwing to allow cron job to start
  }
}

module.exports = {
  getNewInboxEntries,
  getMaxInboxTimestamp
};

