const { callExternalApi } = require('../utils/externalApiCall');
require('dotenv').config();

async function getProposals(payload, cookies = null) {
  try {

    // Get base URL from environment variable
    const baseUrl = process.env.EXTERNAL_API_BASE_URL || process.env.EXTERNAL_LOGIN_API_URL;
    
    if (!baseUrl) {
      console.error('EXTERNAL_API_BASE_URL or EXTERNAL_LOGIN_API_URL not set in environment variables');
      throw new Error('External API base URL not configured');
    }

    const endpoint = '/fibi-base/fibiProposalDashBoard';
    
    // Send the entire payload directly to external API
    // Remove undefined/null values to avoid sending empty fields
    const requestData = {};
    
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null) {
        requestData[key] = payload[key];
      }
    });

    //console.log('Request data being sent to external API:', JSON.stringify(requestData));
    //console.log('Cookies being passed to callExternalApi:', cookies ? (cookies.substring(0, 50) + '...') : 'null');

    // Call external API with cookies
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
    console.error('Error in getProposals:', error);
    throw error;
  }
}

module.exports = {
  getProposals
};

