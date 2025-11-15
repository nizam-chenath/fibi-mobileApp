const { callExternalApi } = require('../utils/externalApiCall');

async function getServiceRequestsFromExternalApi(baseUrl, payload, cookies = null) {
  try {
    // Endpoint for service requests
    const endpoint = '/api/service-requests/my-requests';

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
    console.error('Error in getServiceRequestsFromExternalApi:', error);
    throw error;
  }
}

module.exports = {
  getServiceRequestsFromExternalApi
};

