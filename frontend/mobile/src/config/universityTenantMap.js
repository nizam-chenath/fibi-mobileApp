export const UNIVERSITY_TENANT_MAP = {
  u100: 'jhu-001',
  u101: 'smu-001',
  u102: 'bits-001',
  u103: 'mit-001',
};

export const getTenantIdForUniversity = (uid, fallbackTenantId) =>
  UNIVERSITY_TENANT_MAP[uid] || fallbackTenantId;

export default UNIVERSITY_TENANT_MAP;

