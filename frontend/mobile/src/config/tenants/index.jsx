// config/tenants/index.jsx
import { harvardConfig } from './harvard.jsx';
import { stanfordConfig } from './stanford.jsx';
import { mitConfig } from './mit.jsx';
import { yaleConfig } from './yale.jsx';

const tenantRegistry = {
  'harvard-001': harvardConfig,
  'stanford-001': stanfordConfig,
  'mit-001': mitConfig,
  'yale-001': yaleConfig,
};

export const getTenantById = (tenantId) => {
  return tenantRegistry[tenantId] || null;
};

export const getAllTenants = () => {
  return Object.values(tenantRegistry);
};

export default tenantRegistry;

