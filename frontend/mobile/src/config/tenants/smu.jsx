// config/tenants/smu.jsx
import SMULOGO from '../../assets/universitylogo/Logo2.png';
export const smuConfig = {
  tenantId: 'smu-001',
  name: 'Singapore Management University',
  domain: 'fibi-smu.polussolutions.com',
  apiBaseUrl: 'https://api-smu.fibi.polussolutions.com',
  databaseName: 'smu_fibi_db',
  branding: {
    appName: 'Fibi @ SMU',
    logo: SMULOGO,
    universityName: 'Singapore Management University',
  },
  theme: {
    primary: '#48BD92',
    secondary: '#FFFFFF',
    accent: '#48BD92',
    success: '#48BD92',
    warning: '#FFC107',
    error: '#DC3545',
    background: '#48BD92',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#1C4532',
    border: '#E0E0E0',
    brandPrimary: '#48BD92',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics', 'partnerships'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'partnerships', 'totalFunding'],
  },
};

export default smuConfig;

