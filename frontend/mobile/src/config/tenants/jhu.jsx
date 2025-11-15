// config/tenants/jhu.jsx
import JHULOGO from '../../assets/universitylogo/MIT.png';
export const jhuConfig = {
  tenantId: 'jhu-001',
  name: 'Johns Hopkins University',
  domain: 'fibi-jhu.polussolutions.com',
  apiBaseUrl: 'https://api-jhu.fibi.polussolutions.com',
  databaseName: 'jhu_fibi_db',
  branding: {
    appName: 'Fibi @ Johns Hopkins',
    logo: JHULOGO,
    universityName: 'Johns Hopkins University',
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
    modules: ['grants', 'compliance', 'reports', 'analytics', 'research'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'researchProjects', 'totalFunding'],
  },
};

export default jhuConfig;

