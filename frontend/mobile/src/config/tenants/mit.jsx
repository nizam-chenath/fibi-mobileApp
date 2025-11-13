// config/tenants/mit.jsx
export const mitConfig = {
  tenantId: 'mit-001',
  name: 'Massachusetts Institute of Technology',
  domain: 'fibi-mit.polussolutions.com',
  apiBaseUrl: 'https://api-mit.fibi.polussolutions.com',
  databaseName: 'mit_fibi_db',
  branding: {
    appName: 'Fibi @ MIT',
    logo: { uri: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg' },
    universityName: 'Massachusetts Institute of Technology',
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
    modules: ['grants', 'compliance', 'reports', 'analytics', 'publications'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'publications', 'totalFunding'],
  },
};

export default mitConfig;


