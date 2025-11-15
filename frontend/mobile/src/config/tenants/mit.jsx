// config/tenants/mit.jsx
import MITLOGO from '../../assets/universitylogo/logo3.png';
export const mitConfig = {
  tenantId: 'mit-001',
  name: 'Massachusetts Institute of Technology',
  domain: 'fibi-mit.polussolutions.com',
  apiBaseUrl: 'https://api-mit.fibi.polussolutions.com',
  databaseName: 'mit_fibi_db',
  branding: {
    appName: 'MIT',
    logo: MITLOGO,
    universityName: 'Massachusetts Institute of Technology',
  },
  theme: {
    primary: '#1565C0',        // MIT-inspired blue
    secondary: '#FFFFFF',
    accent: '#0D47A1',
    success: '#1976D2',
    warning: '#FFA000',
    error: '#D84315',
    background: '#E3F2FD',
    surface: '#FFFFFF',
    text: '#0A1C33',
    textSecondary: '#284a7c',
    border: '#BBDEFB',
    brandPrimary: '#0D47A1',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics', 'publications'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'publications', 'totalFunding'],
  },
};

export default mitConfig;


