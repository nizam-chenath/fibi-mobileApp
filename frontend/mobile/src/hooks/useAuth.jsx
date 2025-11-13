// hooks/useAuth.jsx
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, logout, setLoading } from '../store/authSlice.jsx';
import { authService } from '../services/authService.jsx';
import { tokenManager } from '../services/tokenManager.jsx';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const tenantId = useSelector((state) => state.tenant.currentTenantId);

  const login = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const result = await authService.login(email, password, tenantId);

      if (result.success) {
        await tokenManager.saveToken(result.token);
        await tokenManager.saveRefreshToken(result.refreshToken);
        await tokenManager.saveUserData(result.user);

        dispatch(loginSuccess({
          user: result.user,
          token: result.token,
        }));
      } else {
        dispatch(loginFailure(result.error));
      }

      return result;
    } catch (error) {
      dispatch(loginFailure(error.message));
      return { success: false, error: error.message };
    }
  };

  const register = async (payload) => {
    dispatch(setLoading(true));
    try {
      const result = await authService.register(payload, tenantId);

      if (result.success) {
        await tokenManager.saveToken(result.token);
        await tokenManager.saveRefreshToken(result.refreshToken);
        await tokenManager.saveUserData(result.user);

        dispatch(
          loginSuccess({
            user: result.user,
            token: result.token,
          }),
        );
      } else {
        dispatch(loginFailure(result.error));
      }

      return result;
    } catch (error) {
      dispatch(loginFailure(error.message));
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      await authService.logout();
      await tokenManager.clearToken();
      dispatch(logout());
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    ...auth,
    login,
    register,
    logout: handleLogout,
  };
};

export default useAuth;

