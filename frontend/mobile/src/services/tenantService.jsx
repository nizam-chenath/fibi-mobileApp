// services/tenantService.jsx
import { getTenantById, getAllTenants } from '../config/tenants/index.jsx';

class TenantService {
  constructor() {
    this.currentTenant = null;
  }

  initializeTenant(tenantId) {
    const tenant = getTenantById(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }
    this.currentTenant = tenant;
    console.log('Tenant initialized:', tenantId);
    return tenant;
  }

  getCurrentTenant() {
    if (!this.currentTenant) {
      throw new Error('No tenant initialized');
    }
    return this.currentTenant;
  }

  getTenantConfig(tenantId) {
    return getTenantById(tenantId);
  }

  getTenantTheme() {
    return this.getCurrentTenant().theme;
  }

  getAllTenantConfigs() {
    return getAllTenants();
  }
}

export const tenantService = new TenantService();
export default tenantService;

