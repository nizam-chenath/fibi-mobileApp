import { API_BASE_URL } from '../config/config.js';



const extractCookieToken = (cookieHeader) => {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(',').map((segment) => segment.trim());
  for (const cookie of cookies) {
    const [pair] = cookie.split(';');
    const [name, value] = pair.split('=');
    if (name === 'Cookie_Token') {
      return value;
    }
  }
  return null;
};

export const loginRequest = async ({ username, password, uid }) => {
  console.log('API_BASE_URL', API_BASE_URL);
  console.log('username', username);
  console.log('password', password);
  console.log('uid', uid);
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, uid }),
  });
  console.log('response', response);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Login failed (${response.status})`);
  }

  const data = await response.json();
  if (!data || typeof data !== 'object' || !data.user) {
    throw new Error('Unexpected login response');
  }

  const cookieHeader = response.headers?.get('set-cookie');
  const cookieToken = extractCookieToken(cookieHeader);

  return { data, cookieToken };
};

export default {
  loginRequest,
};

