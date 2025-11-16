const { callExternalApi } = require('../utils/externalApiCall');
require('dotenv').config();

/**
 * Get research summary table data from external API
 * @param {object} payload - Request payload with escentFlag, isAdmin, tabName, unitNumber
 * @param {string} cookies - Cookie header string to forward to external API
 * @returns {Promise<object>} - API response with data and cookies
 */
async function getResearchSummaryTable(payload, cookies = null) {
  try {
    // Get base URL from environment variable
    const baseUrl = process.env.EXTERNAL_API_BASE_URL || process.env.EXTERNAL_LOGIN_API_URL;
    
    if (!baseUrl) {
      console.error('EXTERNAL_API_BASE_URL or EXTERNAL_LOGIN_API_URL not set in environment variables');
      throw new Error('External API base URL not configured');
    }

    // Endpoint for research summary table
    const endpoint = '/getResearchSummaryDatasByWidget';

    // Remove undefined/null values to avoid sending empty fields
    const requestData = {};
    
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null) {
        requestData[key] = payload[key];
      }
    });

    // Call external API with cookies and payload
    const result = await callExternalApi(baseUrl, endpoint, 'POST', requestData, {
      connectionTimeout: 10000,
      requestTimeout: 30000,
      convertKeysToLowercase: true,
      returnFirstArrayElement: false,
      returnCookies: true, // Return cookies from external API
      cookies: cookies // Pass cookies to external API
    });

    return result;
  } catch (error) {
    console.error('Error in getResearchSummaryTable:', error);
    throw error;
  }
}

module.exports = {
  getResearchSummaryTable
};

