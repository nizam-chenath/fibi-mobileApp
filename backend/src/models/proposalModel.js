const { callExternalApi } = require('../utils/externalApiCall');

async function getProposalsFromExternalApi(baseUrl, payload, cookies = null) {
  try {
    // Default endpoint for proposals
    const endpoint = '/api/proposals/my-proporsals';

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
    console.error('Error in getProposalsFromExternalApi:', error);
    throw error;
  }
}

module.exports = {
  getProposalsFromExternalApi
};

