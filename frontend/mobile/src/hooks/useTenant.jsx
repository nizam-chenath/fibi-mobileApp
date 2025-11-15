// hooks/useTenant.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTenant } from '../store/tenantSlice.jsx';
import { tenantService } from '../services/tenantService.jsx';

export const useTenant = () => {
  const dispatch = useDispatch();
  const tenant = useSelector((state) => state.tenant);

  const switchTenant = (tenantId) => {
    try {
      const config = tenantService.initializeTenant(tenantId);
      dispatch(setCurrentTenant({
        tenantId,
        config,
      }));
      return { success: true };
    } catch (error) {
      console.error('Error switching tenant:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    currentTenantId: tenant.currentTenantId,
    tenantConfig: tenant.tenantConfig,
    currentUniversityUid: tenant.currentUniversityUid,
    selectedUniversityName: tenant.selectedUniversityName,
    selectedUniversityThemeColor: tenant.selectedUniversityThemeColor,
    switchTenant,
  };
};

export default useTenant;

