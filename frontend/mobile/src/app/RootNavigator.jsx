// app/RootNavigator.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import UniversitySelectionScreen from '../screens/UniversitySelectionScreen.jsx';
import LoginScreen from '../screens/LoginScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import SplashScreen from '../screens/SplashScreen.jsx';
import { setCurrentTenant } from '../store/tenantSlice.jsx';
import { getTenantById } from '../config/tenants/index.jsx';
import useAuth from '../hooks/useAuth.jsx';
import ChatbotWidget from '../components/ChatbotWidget.jsx';

const RootNavigator = () => {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, logout } = useAuth();

  const handleAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  const handleSelectUniversity = (tenantId) => {
    const config = getTenantById(tenantId);
    if (config) {
      dispatch(setCurrentTenant({ tenantId, config }));
      setSelectedUniversity(tenantId);
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

  const shouldShowChatbot = !showAnimatedSplash && !!selectedUniversity;

  return (
    <>
      {content}
      {shouldShowChatbot && <ChatbotWidget />}
    </>
  );
};

export default RootNavigator;

