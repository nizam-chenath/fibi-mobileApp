// config/tenants/yale.jsx
export const yaleConfig = {
  tenantId: 'yale-001',
  name: 'Yale University',
  domain: 'fibi-yale.polussolutions.com',
  apiBaseUrl: 'https://api-yale.fibi.polussolutions.com',
  databaseName: 'yale_fibi_db',
  branding: {
    appName: 'Yale',
    logo: { uri: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Yale_University_Shield_1.svg' },
    universityName: 'Yale University',
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
    statsDisplay: ['activeGrants', 'pendingProposals', 'complianceTasks', 'totalFunding'],
  },
};

export default yaleConfig;


