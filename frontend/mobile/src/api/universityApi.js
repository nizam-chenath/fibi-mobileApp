import { API_BASE_URL } from '../config/config.js';

const UNIVERSITIES_ENDPOINT = '/api/universities/all-universities';

export const fetchUniversities = async () => {
  const response = await fetch(`${API_BASE_URL}${UNIVERSITIES_ENDPOINT}`);
  if (!response.ok) {
    throw new Error(`Failed to load universities (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected university response format');
  }
  return data;
};

export default fetchUniversities;

