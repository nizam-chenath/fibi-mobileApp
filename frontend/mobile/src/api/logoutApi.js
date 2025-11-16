import apiClient from './apiClient.js';

const LOGOUT_ENDPOINT = '/api/logout';

export const logoutRequest = async () => {
  // Authenticated request; cookie token will be attached by apiClient
  return apiClient.post(LOGOUT_ENDPOINT, null);
};

export default {
  logoutRequest,
};


