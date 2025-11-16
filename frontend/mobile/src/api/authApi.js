import apiClient from './apiClient.js';

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
  const { data, response } = await apiClient.post(
    '/api/login',
    { username, password, uid },
    { auth: false, returnResponse: true },
  );

  if (!data || typeof data !== 'object' || !data.user) {
    throw new Error('Unexpected login response');
  }

  const cookieHeader =
    response.headers?.get('set-cookie') || response.headers?.get('Set-Cookie');
  const cookieToken = extractCookieToken(cookieHeader);

  return { data, cookieToken };
};

export default {
  loginRequest,
};

