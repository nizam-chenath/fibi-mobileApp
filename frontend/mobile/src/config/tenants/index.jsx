// config/tenants/index.jsx
import { bitsConfig } from './bits.jsx';
import { jhuConfig } from './jhu.jsx';
import { smuConfig } from './smu.jsx';
import { mitConfig } from './mit.jsx';

const tenantRegistry = {
  'bits-001': bitsConfig,
  'jhu-001': jhuConfig,
  'smu-001': smuConfig,
  'mit-001': mitConfig,
};

export const getTenantById = (tenantId) => {
  return tenantRegistry[tenantId] || null;
};

export const getAllTenants = () => {
  return Object.values(tenantRegistry);
};

export default tenantRegistry;

