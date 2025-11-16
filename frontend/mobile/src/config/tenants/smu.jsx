// config/tenants/smu.jsx
import SMULOGO from '../../assets/universitylogo/Logo2.png';
export const smuConfig = {
  tenantId: 'smu-001',
  name: 'Singapore Management University',
  domain: 'fibi-smu.polussolutions.com',
  apiBaseUrl: 'https://api-smu.fibi.polussolutions.com',
  databaseName: 'smu_fibi_db',
  branding: {
    appName: 'SMU',
    logo: SMULOGO,
    universityName: 'Singapore Management University',
  },
  theme: {
    primary: '#F9A825',        // vibrant yellow/gold
    secondary: '#1A1A1A',
    accent: '#FF6F00',
    success: '#FBC02D',
    warning: '#FF8F00',
    error: '#E65100',
    background: '#FFF8E1',
    surface: '#FFFFFF',
    text: '#3A2A00',
    textSecondary: '#725C00',
    border: '#FFECB3',
    brandPrimary: '#FF8F00',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics', 'partnerships'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'partnerships', 'totalFunding'],
  },
};

export default smuConfig;

