// services/universityManager.jsx
import EncryptedStorage from 'react-native-encrypted-storage';

const UNIVERSITY_UID_KEY = 'fibi_university_uid';
const UNIVERSITY_NAME_KEY = 'fibi_university_name';
const UNIVERSITY_THEME_KEY = 'fibi_university_theme';

class UniversityManager {
  async saveSelection({ universityUid, universityName, universityThemeColor }) {
    if (universityUid) {
      await EncryptedStorage.setItem(UNIVERSITY_UID_KEY, universityUid);
    } else {
      await EncryptedStorage.removeItem(UNIVERSITY_UID_KEY);
    }

    if (universityName) {
      await EncryptedStorage.setItem(UNIVERSITY_NAME_KEY, universityName);
    } else {
      await EncryptedStorage.removeItem(UNIVERSITY_NAME_KEY);
    }

    if (universityThemeColor) {
      await EncryptedStorage.setItem(UNIVERSITY_THEME_KEY, universityThemeColor);
    } else {
      await EncryptedStorage.removeItem(UNIVERSITY_THEME_KEY);
    }
  }

  async getUniversityUid() {
    return EncryptedStorage.getItem(UNIVERSITY_UID_KEY);
  }

  async getUniversityName() {
    return EncryptedStorage.getItem(UNIVERSITY_NAME_KEY);
  }

  async getUniversityThemeColor() {
    return EncryptedStorage.getItem(UNIVERSITY_THEME_KEY);
  }

  async clear() {
    await EncryptedStorage.removeItem(UNIVERSITY_UID_KEY);
    await EncryptedStorage.removeItem(UNIVERSITY_NAME_KEY);
    await EncryptedStorage.removeItem(UNIVERSITY_THEME_KEY);
  }
}

export const universityManager = new UniversityManager();
export default universityManager;


