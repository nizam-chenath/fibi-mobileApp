import apiClient from './apiClient.js';

const UNIVERSITIES_ENDPOINT = '/api/universities/all-universities';

export const fetchUniversities = async () => {
  const data = await apiClient.get(UNIVERSITIES_ENDPOINT, { auth: false });
  if (!Array.isArray(data)) {
    throw new Error('Unexpected university response format');
  }
  return data;
};

export default fetchUniversities;
