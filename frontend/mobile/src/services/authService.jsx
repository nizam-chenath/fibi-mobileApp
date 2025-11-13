// services/authService.jsx
import { getAuthenticatedUser, registerUser } from '../mockData/users.jsx';

class AuthService {
  async login(email, password, tenantId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = getAuthenticatedUser(email, password, tenantId);

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      const token = `mock_token_${Date.now()}`;
      const refreshToken = `mock_refresh_${Date.now()}`;

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          department: user.department,
          role: user.role,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login',
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export const authService = new AuthService();
export default authService;

