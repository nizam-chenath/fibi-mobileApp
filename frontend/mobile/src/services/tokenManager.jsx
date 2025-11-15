// services/tokenManager.jsx
import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'fibi_token';
const REFRESH_TOKEN_KEY = 'fibi_refresh_token';
const USER_DATA_KEY = 'fibi_user';

class TokenManager {
  async saveToken(token) {
    if (!token) {
      await EncryptedStorage.removeItem(TOKEN_KEY);
      return;
    }
    await EncryptedStorage.setItem(TOKEN_KEY, token);
  }

  async getToken() {
    return EncryptedStorage.getItem(TOKEN_KEY);
  }

  async saveRefreshToken(refreshToken) {
    if (!refreshToken) {
      await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async getRefreshToken() {
    return EncryptedStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async saveUserData(user) {
    if (!user) {
      await EncryptedStorage.removeItem(USER_DATA_KEY);
      return;
    }
    await EncryptedStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  async getUserData() {
    const data = await EncryptedStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  async clearToken() {
    await EncryptedStorage.removeItem(TOKEN_KEY);
    await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
    await EncryptedStorage.removeItem(USER_DATA_KEY);
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;