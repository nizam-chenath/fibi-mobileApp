// config/tenants/bits.jsx
import bitsLogo from '../../assets/universitylogo/MIT.png';

export const bitsConfig = {
  tenantId: 'bits-001',
  name: 'Birla Institute of Technology and Science, Pilani',
  domain: 'fibi-bits.polussolutions.com',
  apiBaseUrl: 'https://api-bits.fibi.polussolutions.com',
  databaseName: 'bits_fibi_db',
  branding: {
    appName: 'Fibi @ BITS Pilani',
    logo: bitsLogo,
    universityName: 'Birla Institute of Technology and Science, Pilani',
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

export default bitsConfig;

