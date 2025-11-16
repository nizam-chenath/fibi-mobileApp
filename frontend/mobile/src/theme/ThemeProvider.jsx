// theme/ThemeProvider.jsx
import React, { createContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getTenantById } from '../config/tenants/index.jsx';
import { defaultSpacing, borderRadius } from './spacing.jsx';
import { DEFAULT_TENANT_ID } from '../config/constants.jsx';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const tenantState = useSelector((state) => state.tenant);
  const tenantId = tenantState?.currentTenantId;
  const selectedUniversityName = tenantState?.selectedUniversityName;
  const selectedUniversityThemeColor = tenantState?.selectedUniversityThemeColor;
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
      background: '#F2F3F8',
      surface: '#FFFFFF',
      text: '#1C1C1C',
      textSecondary: '#555555',
      border: '#DDDDDD',
      brandPrimary: BRAND_GREEN,
      Lightbackground: '#f2f3f8',
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
    // Prefer Lightbackground as the app-wide background if provided
    combinedColors.background =
      combinedColors.Lightbackground || combinedColors.background || baseColors.background;
    combinedColors.surface = combinedColors.surface || baseColors.surface;
    combinedColors.brandPrimary = combinedColors.brandPrimary || combinedColors.primary;

    const defaultBranding = {
      appName: 'Fibi Demo',
      universityName: 'Demo University',
      logo: null,
    };

    const activeBranding = {
      ...(tenantConfig?.branding || defaultBranding),
      universityName:
        selectedUniversityName ||
        tenantConfig?.branding?.universityName ||
        defaultBranding.universityName,
    };

    return {
      colors: combinedColors,
      spacing: defaultSpacing,
      borderRadius,
      branding: activeBranding,
    };
  }, [tenantId, isAuthenticated, selectedUniversityName, selectedUniversityThemeColor]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

