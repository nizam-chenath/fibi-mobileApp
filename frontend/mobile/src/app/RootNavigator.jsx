// app/RootNavigator.jsx
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import UniversitySelectionScreen from '../screens/UniversitySelectionScreen.jsx';
import LoginScreen from '../screens/LoginScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import SplashScreen from '../screens/SplashScreen.jsx';
import SignUpScreen from '../screens/SignUpScreen.jsx';
import { setCurrentTenant } from '../store/tenantSlice.jsx';
import { getTenantById } from '../config/tenants/index.jsx';
import useAuth from '../hooks/useAuth.jsx';

const RootNavigator = () => {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, logout } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  const handleAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  const handleSelectUniversity = (tenantId) => {
    const config = getTenantById(tenantId);
    if (config) {
      dispatch(setCurrentTenant({ tenantId, config }));
      setSelectedUniversity(tenantId);
      setAuthMode('login');
    }
  };

  if (showAnimatedSplash) {
    return <SplashScreen onFinish={handleAnimatedSplashFinish} />;
  }

  // Show university selection if not selected yet
  if (!selectedUniversity) {
    return <UniversitySelectionScreen onSelectUniversity={handleSelectUniversity} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'signup') {
      return (
        <SignUpScreen
          onNavigateToLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <LoginScreen
        onNavigateToSignUp={() => setAuthMode('signup')}
      />
    );
  }

  // Show dashboard if authenticated
  return <DashboardScreen onLogout={logout} />;
};

export default RootNavigator;

