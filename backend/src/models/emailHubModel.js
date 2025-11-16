const { callExternalApi } = require('../utils/externalApiCall');

async function getEmailHubFromExternalApi(baseUrl, payload, cookies = null) {
  try {
    // Endpoint for email hub
    const endpoint = '/api/email-hub/my-notifications';

    // Call external API (university_backend) with cookies and payload
    const result = await callExternalApi(baseUrl, endpoint, 'POST', payload, {
      connectionTimeout: 10000,
      requestTimeout: 30000,
      convertKeysToLowercase: true,
      returnFirstArrayElement: false,
      returnCookies: true, // Return cookies from external API
      cookies: cookies // Pass cookies to external API
    });

    return result;
  } catch (error) {
    console.error('Error in getEmailHubFromExternalApi:', error);
    throw error;
  }
}

async function getMessageTypesFromExternalApi(baseUrl, payload, cookies = null) {
  try {
    // Endpoint for message types
    const endpoint = '/api/message_types/my-message-types';

    // Call external API (university_backend) with cookies and payload
    const result = await callExternalApi(baseUrl, endpoint, 'POST', payload, {
      connectionTimeout: 10000,
      requestTimeout: 30000,
      convertKeysToLowercase: true,
      returnFirstArrayElement: false,
      returnCookies: true, // Return cookies from external API
      cookies: cookies // Pass cookies to external API
    });

    return result;
  } catch (error) {
    console.error('Error in getMessageTypesFromExternalApi:', error);
    throw error;
  }
}

module.exports = {
  getEmailHubFromExternalApi,
  getMessageTypesFromExternalApi
};

