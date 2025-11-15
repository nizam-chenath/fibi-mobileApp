const { callExternalApi } = require('../utils/externalApiCall');
require('dotenv').config();

async function callExternalLoginApi(username, password) {
  try {
    // Get base URL from environment variable
    const baseUrl = process.env.EXTERNAL_API_BASE_URL || process.env.EXTERNAL_LOGIN_API_URL;
    
    if (!baseUrl) {
      console.error('EXTERNAL_API_BASE_URL or EXTERNAL_LOGIN_API_URL not set in environment variables');
      return null;
    }

    const endpoint = '/auth/login';
    const requestData = { username, password };

    // Call external API and return cookies if available
    const result = await callExternalApi(baseUrl, endpoint, 'POST', requestData, {
      connectionTimeout: 10000,
      requestTimeout: 30000,
      convertKeysToLowercase: true,
      returnFirstArrayElement: false,
      returnCookies: true // Return cookies from external API
    });

    return result;
  } catch (error) {
    console.error('Error in callExternalLoginApi:', error);
    throw error;
  }
}

module.exports = {
  callExternalLoginApi
};

