// config/tenants/harvard.jsx
export const harvardConfig = {
  tenantId: 'harvard-001',
  name: 'Harvard University',
  domain: 'fibi-harvard.polussolutions.com',
  apiBaseUrl: 'https://api-harvard.fibi.polussolutions.com',
  databaseName: 'harvard_fibi_db',
  branding: {
    appName: 'Fibi @ Harvard',
    logo: { uri: 'https://upload.wikimedia.org/wikipedia/en/2/29/Harvard_shield_wreath.svg' },
    universityName: 'Harvard University',
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
    modules: ['grants', 'compliance', 'reports', 'analytics'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'complianceTasks', 'totalFunding'],
  },
};

export default harvardConfig;

