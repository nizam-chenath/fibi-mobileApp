// app/RootNavigator.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import UniversitySelectionScreen from '../screens/UniversitySelectionScreen.jsx';
import LoginScreen from '../screens/LoginScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import SplashScreen from '../screens/SplashScreen.jsx';
import { setCurrentTenant } from '../store/tenantSlice.jsx';
import { getTenantById } from '../config/tenants/index.jsx';
import { DEFAULT_TENANT_ID } from '../config/constants.jsx';
import { getTenantIdForUniversity } from '../config/universityTenantMap.js';
import useAuth from '../hooks/useAuth.jsx';
import ChatbotWidget from '../components/ChatbotWidget.jsx';
import { universityManager } from '../services/universityManager.jsx';
import { tokenManager } from '../services/tokenManager.jsx';
import { loginSuccess } from '../store/authSlice.jsx';

const RootNavigator = () => {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, logout } = useAuth();

  const handleAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  // Hydrate previously selected university and auth session on app start
  useEffect(() => {
    const hydrateAppState = async () => {
      try {
        // Restore university selection and tenant config
        const savedUniversityUid = await universityManager.getUniversityUid();
        if (savedUniversityUid) {
          setSelectedUniversity(savedUniversityUid);
          const tenantId = getTenantIdForUniversity(savedUniversityUid, DEFAULT_TENANT_ID);
          const config = getTenantById(tenantId);
          const universityName = await universityManager.getUniversityName();
          const universityThemeColor = await universityManager.getUniversityThemeColor();
          if (config) {
            dispatch(
              setCurrentTenant({
                tenantId,
                config,
                universityUid: savedUniversityUid,
                universityName,
                universityThemeColor,
              }),
            );
          }
        }

        // Restore authentication session
        const savedToken = await tokenManager.getToken();
        const savedUser = await tokenManager.getUserData();
        if (savedToken && savedUser) {
          dispatch(
            loginSuccess({
              user: savedUser,
              token: savedToken,
            }),
          );
        }
      } catch (e) {
        // Non-fatal; continue to normal flow
        console.warn('[RootNavigator] hydrateAppState failed:', e?.message || e);
      }
    };
    hydrateAppState();
  }, [dispatch]);

  const handleSelectUniversity = ({ universityUid, name, themeColor }) => {
    const tenantId = getTenantIdForUniversity(universityUid, DEFAULT_TENANT_ID);
    const config = getTenantById(tenantId);
    if (config) {
      // persist selection for API layer and future sessions
      universityManager.saveSelection({
        universityUid,
        universityName: name,
        universityThemeColor: themeColor,
      });
      dispatch(
        setCurrentTenant({
          tenantId,
          config,
          universityUid,
          universityName: name,
          universityThemeColor: themeColor,
        }),
      );
      setSelectedUniversity(universityUid);
    } else {
      console.warn('[RootNavigator] No config found for tenantId:', tenantId);
    }
  };

  const content = useMemo(() => {
    if (showAnimatedSplash) {
      return <SplashScreen onFinish={handleAnimatedSplashFinish} />;
    }

    if (!selectedUniversity) {
      return <UniversitySelectionScreen onSelectUniversity={handleSelectUniversity} />;
    }

    if (!isAuthenticated) {
      return <LoginScreen />;
    }

    return <DashboardScreen onLogout={logout} />;
  }, [
    handleAnimatedSplashFinish,
    handleSelectUniversity,
    isAuthenticated,
    logout,
    selectedUniversity,
    showAnimatedSplash,
  ]);

  const shouldShowChatbot = !showAnimatedSplash && isAuthenticated;

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F8' }}>
      <StatusBar translucent={false} backgroundColor="#F2F3F8" barStyle="dark-content" />
      {content}
      {shouldShowChatbot && <ChatbotWidget />}
    </View>
  );
};

export default RootNavigator;

