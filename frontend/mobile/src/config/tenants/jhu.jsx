// config/tenants/jhu.jsx
import JHULOGO from '../../assets/universitylogo/Logo1.png';
export const jhuConfig = {
  tenantId: 'jhu-001',
  name: 'Johns Hopkins University',
  domain: 'fibi-jhu.polussolutions.com',
  apiBaseUrl: 'https://api-jhu.fibi.polussolutions.com',
  databaseName: 'jhu_fibi_db',
  branding: {
    appName: 'Johns Hopkins',
    logo: JHULOGO,
    universityName: 'Johns Hopkins University',
  },
  theme: {
    primary: '#2E7D32',       // rich green
    secondary: '#FFFFFF',
    accent: '#1B5E20',
    success: '#43A047',
    warning: '#FFB300',
    error: '#C62828',
    background: '#E8F5E9',
    surface: '#FFFFFF',
    text: '#1A321B',
    textSecondary: '#336633',
    border: '#C8E6C9',
    brandPrimary: '#1B5E20',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics', 'research'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'researchProjects', 'totalFunding'],
  },
};

export default jhuConfig;

