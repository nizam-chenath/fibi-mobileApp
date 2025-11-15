import { CHATBOT_BASE_URL } from '../config/config.js';
import { tokenManager } from './tokenManager.jsx';

export const fetchServiceTrackerData = async (payload) => {
  console.log("called");
  const url = `${CHATBOT_BASE_URL}/loadDashBoardData`;
  console.log('API Request URL:', url);
  console.log('payload:', payload);

  // Call real backend endpoint similar to proposals API
  const endpoint = `${CHATBOT_BASE_URL}/loadDashBoardData`;
  const cookieToken = await tokenManager.getToken();

  const headers = {
    'Content-Type': 'application/json',
  };
  if (cookieToken) {
    headers.Cookie = `Cookie_Token=${cookieToken}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to fetch service tracker data (${response.status})`);
  }

  const data = await response.json();
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected service tracker response format');
  }

  // return the dashboard data object
  return data;

  // Get fresh token from tokenManager
//   const token = await tokenManager.getToken();
//   console.log('Using Cookie_Token:', token);

  try {
    // Build headers; only include Cookie_Token if available to avoid undefined errors
    const headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      Origin: 'http://192.168.1.252:9000',
      Referer: 'http://192.168.1.252:9000/fibi/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0',
    };

    if (typeof CHATBOT_COOKIE_TOKEN !== 'undefined' && CHATBOT_COOKIE_TOKEN) {
      headers.Cookie = `usetiful-visitor-ident=4717c5a4-72a2-4f05-3bf3-e1fd3a91d08f; Cookie_Token=${CHATBOT_COOKIE_TOKEN}`;
    } else {
      console.warn('CHATBOT_COOKIE_TOKEN is undefined — request will be sent without Cookie_Token');
    }

    const response = await axios.post(url, payload, {
      headers,
      withCredentials: true,
    });
    console.log('API Request Headers:', response.config.headers);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Call Error:', error.message);
    console.error('Error Details:', error.response?.data || error);
    throw error;
  }
};
