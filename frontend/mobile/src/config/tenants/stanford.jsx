// config/tenants/stanford.jsx
export const stanfordConfig = {
  tenantId: 'stanford-001',
  name: 'Stanford University',
  domain: 'fibi-stanford.polussolutions.com',
  apiBaseUrl: 'https://api-stanford.fibi.polussolutions.com',
  databaseName: 'stanford_fibi_db',
  branding: {
    appName: 'Fibi @ Stanford',
    logo: { uri: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_Cardinal_logo.svg' },
    universityName: 'Stanford University',
  },
  theme: {
    primary: '#48BD92',
    secondary: '#FFFFFF',
    accent: '#48BD92',
    success: '#48BD92',
    warning: '#F39C12',
    error: '#E74C3C',
    background: '#48BD92',
    surface: '#FFFFFF',
    text: '#1C1C1C',
    textSecondary: '#1C4532',
    border: '#DDDDDD',
    brandPrimary: '#48BD92',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics', 'publications'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'publications', 'totalFunding'],
  },
};

export default stanfordConfig;

