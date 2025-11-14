// services/tokenManager.jsx
let storedToken = null;
let storedRefreshToken = null;
let userData = null;

class TokenManager {
  async saveToken(token) {
    storedToken = token;
    console.log('Token saved');
  }

  async getToken() {
    return storedToken;
  }

  async saveRefreshToken(refreshToken) {
    storedRefreshToken = refreshToken;
    console.log('Refresh token saved');
  }

  async getRefreshToken() {
    return storedRefreshToken;
  }

  async saveUserData(user) {
    userData = user;
  }

  async getUserData() {
    return userData;
  }

  async clearToken() {
    storedToken = null;
    storedRefreshToken = null;
    userData = null;
    console.log('All tokens cleared');
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;

