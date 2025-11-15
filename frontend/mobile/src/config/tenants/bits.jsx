// config/tenants/bits.jsx
import bitsLogo from '../../assets/universitylogo/Logo4.png';

export const bitsConfig = {
  tenantId: 'bits-001',
  name: 'Birla Institute of Technology and Science, Pilani',
  domain: 'fibi-bits.polussolutions.com',
  apiBaseUrl: 'https://api-bits.fibi.polussolutions.com',
  databaseName: 'bits_fibi_db',
  branding: {
    appName: 'BITS Pilani',
    logo: bitsLogo,
    universityName: 'Birla Institute of Technology and Science, Pilani',
  },
  theme: {
    primary: '#B71C1C',       // deep red
    secondary: '#FFFFFF',
    accent: '#880E4F',
    success: '#C62828',
    warning: '#F57C00',
    error: '#D32F2F',
    background: '#FCE4EC',
    surface: '#FFFFFF',
    text: '#2D0A0A',
    textSecondary: '#7F1D1D',
    border: '#F8BBD0',
    brandPrimary: '#C62828',
  },
  dashboard: {
    modules: ['grants', 'compliance', 'reports', 'analytics'],
    statsDisplay: ['activeGrants', 'pendingProposals', 'complianceTasks', 'totalFunding'],
  },
};

export default bitsConfig;

