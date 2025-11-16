// services/authService.jsx
import { loginRequest } from '../api/authApi.js';
import { getAuthenticatedUser, registerUser } from '../mockData/users.jsx';
import { logoutRequest } from '../api/logoutApi.js';

class AuthService {
  async login(username, password, tenantId, universityUid) {
    try {
      if (!universityUid) {
        throw new Error('University selection is required before login');
      }

      const payload = { username, password, uid: universityUid };
      const { data, cookieToken } = await loginRequest(payload);

      const normalizedUser = data.user
        ? {
            id: data.user.personid,
            email: data.user.email,
            firstName: data.user.firstname,
            lastName: data.user.lastname,
            department: data.user.unitname,
            role: data.user.primarytitle || data.user.status,
            avatar: null,
          }
        : null;

      return {
        success: true,
        user: normalizedUser,
        message: data.message,
        token: cookieToken || normalizedUser?.id || `session_${Date.now()}`,
        refreshToken: null,
        cookieToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during login',
      };
    }
  }

  async register(payload, tenantId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const registration = registerUser(payload, tenantId);

      if (!registration.success) {
        return {
          success: false,
          error: registration.error,
        };
      }

      return this.login(payload.email, payload.password, tenantId);
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'An error occurred during registration',
      };
    }
  }

  async logout() {
    try {
      await logoutRequest();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export const authService = new AuthService();
export default authService;

