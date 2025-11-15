// services/tokenManager.jsx
let AsyncStorage = null;
let EncryptedStorage = null;
let useEncryptedStorage = false;
let useAsyncStorage = false;

// Try to import AsyncStorage
try {
  const asyncStorageModule = require('@react-native-async-storage/async-storage');
  AsyncStorage = asyncStorageModule.default || asyncStorageModule;
  if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
    useAsyncStorage = true;
    console.log('[TokenManager] AsyncStorage available');
  }
} catch (error) {
  console.warn('[TokenManager] AsyncStorage not available:', error.message);
}

// Try to import EncryptedStorage, fallback to AsyncStorage if unavailable
try {
  const encryptedStorageModule = require('react-native-encrypted-storage');
  EncryptedStorage = encryptedStorageModule.default || encryptedStorageModule;
  // Test if the native module is available
  if (EncryptedStorage && typeof EncryptedStorage.setItem === 'function') {
    useEncryptedStorage = true;
    console.log('[TokenManager] Using EncryptedStorage');
  } else {
    throw new Error('EncryptedStorage native module not available');
  }
} catch (error) {
  console.warn('[TokenManager] EncryptedStorage not available, falling back to AsyncStorage:', error.message);
  useEncryptedStorage = false;
  if (!useAsyncStorage) {
    console.error('[TokenManager] Neither EncryptedStorage nor AsyncStorage is available!');
  }
}

const TOKEN_KEY = 'fibi_token';
const REFRESH_TOKEN_KEY = 'fibi_refresh_token';
const USER_DATA_KEY = 'fibi_user';

class TokenManager {
  async _setItem(key, value) {
    try {
      if (useEncryptedStorage && EncryptedStorage) {
        await EncryptedStorage.setItem(key, value);
      } else if (useAsyncStorage && AsyncStorage) {
        await AsyncStorage.setItem(key, value);
      } else {
        console.warn(`[TokenManager] No storage available, data not persisted for ${key}`);
        // Store in memory as last resort (will be lost on app restart)
        if (!this._memoryStorage) {
          this._memoryStorage = {};
        }
        this._memoryStorage[key] = value;
      }
    } catch (error) {
      console.error(`[TokenManager] Error saving ${key}:`, error);
      // Fallback to memory storage
      if (!this._memoryStorage) {
        this._memoryStorage = {};
      }
      this._memoryStorage[key] = value;
    }
  }

  async _getItem(key) {
    try {
      if (useEncryptedStorage && EncryptedStorage) {
        return await EncryptedStorage.getItem(key);
      } else if (useAsyncStorage && AsyncStorage) {
        return await AsyncStorage.getItem(key);
      } else {
        // Fallback to memory storage
        return this._memoryStorage?.[key] || null;
      }
    } catch (error) {
      console.error(`[TokenManager] Error reading ${key}:`, error);
      // Fallback to memory storage
      return this._memoryStorage?.[key] || null;
    }
  }

  async _removeItem(key) {
    try {
      if (useEncryptedStorage && EncryptedStorage) {
        await EncryptedStorage.removeItem(key);
      } else if (useAsyncStorage && AsyncStorage) {
        await AsyncStorage.removeItem(key);
      }
      // Also remove from memory storage
      if (this._memoryStorage) {
        delete this._memoryStorage[key];
      }
    } catch (error) {
      console.error(`[TokenManager] Error removing ${key}:`, error);
      // Still try to remove from memory
      if (this._memoryStorage) {
        delete this._memoryStorage[key];
      }
    }
  }

  async saveToken(token) {
    if (!token) {
      await this._removeItem(TOKEN_KEY);
      return;
    }
    await this._setItem(TOKEN_KEY, token);
  }

  async getToken() {
    return await this._getItem(TOKEN_KEY);
  }

  async saveRefreshToken(refreshToken) {
    if (!refreshToken) {
      await this._removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    await this._setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async getRefreshToken() {
    return await this._getItem(REFRESH_TOKEN_KEY);
  }

  async saveUserData(user) {
    if (!user) {
      await this._removeItem(USER_DATA_KEY);
      return;
    }
    await this._setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  async getUserData() {
    const data = await this._getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  async clearToken() {
    await this._removeItem(TOKEN_KEY);
    await this._removeItem(REFRESH_TOKEN_KEY);
    await this._removeItem(USER_DATA_KEY);
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;