// theme/ThemeProvider.jsx
import React, { createContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTenantById } from '../config/tenants/index.jsx';
import { defaultSpacing, borderRadius } from './spacing.jsx';
import { DEFAULT_TENANT_ID } from '../config/constants.jsx';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const tenantId = useSelector((state) => state.tenant?.currentTenantId);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const theme = useMemo(() => {
    const BRAND_GREEN = '#48BD92';
    const baseColors = {
      primary: BRAND_GREEN,
      secondary: '#FFFFFF',
      accent: BRAND_GREEN,
      success: BRAND_GREEN,
      warning: '#FFC107',
      error: '#E74C3C',
      background: BRAND_GREEN,
      surface: '#FFFFFF',
      text: '#1C1C1C',
      textSecondary: '#555555',
      border: '#DDDDDD',
      brandPrimary: BRAND_GREEN,
    };

    const fallbackConfig = getTenantById(DEFAULT_TENANT_ID);
    const tenantConfig = getTenantById(tenantId) || fallbackConfig;
    const combinedColors = {
      ...baseColors,
      ...(isAuthenticated ? tenantConfig?.theme : null),
    };

    combinedColors.primary = combinedColors.primary || baseColors.primary;
    combinedColors.accent = combinedColors.accent || combinedColors.primary;
    combinedColors.success = combinedColors.success || combinedColors.primary;
    combinedColors.background = combinedColors.background || combinedColors.primary;
    combinedColors.surface = combinedColors.surface || baseColors.surface;
    combinedColors.brandPrimary = combinedColors.brandPrimary || combinedColors.primary;

    return {
      colors: combinedColors,
      spacing: defaultSpacing,
      borderRadius,
      branding:
        tenantConfig?.branding || {
          appName: 'Fibi Demo',
          universityName: 'Demo University',
          logo: null,
        },
    };
  }, [tenantId, isAuthenticated]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

