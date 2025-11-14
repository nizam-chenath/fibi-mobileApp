// screens/DashboardScreen.jsx
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import { getDashboardData } from '../mockData/dashboard.jsx';
import { getActivitiesByTenant } from '../mockData/activities.jsx';
import Header from '../components/Header.jsx';
import StatsCard from '../components/StatsCard.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';

const DashboardScreen = ({ onLogout }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const tenantId = useSelector((state) => state.tenant.currentTenantId);
  const dashboardData = getDashboardData(tenantId, user?.role);
  const activities = getActivitiesByTenant(tenantId);

  const resolvedStats = dashboardData.stats?.map((stat) => {
    const colorToken = stat.colorToken || stat.color;
    return {
      ...stat,
      color: theme.colors[colorToken] || stat.color || theme.colors.primary,
    };
  });

  const resolvedModules = dashboardData.modules?.map((module) => {
    const accentToken = module.accentColorToken || module.accentColor;
    return {
      ...module,
      accentColor:
        theme.colors[accentToken] || module.accentColor || theme.colors.primary,
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xxl,
    },
    welcomeSection: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    welcomeText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.secondary,
      marginBottom: theme.spacing.xs,
    },
    userInfo: {
      fontSize: 14,
      color: theme.colors.secondary,
      opacity: 0.9,
    },
    overviewMeta: {
      fontSize: 12,
      color: theme.colors.secondary,
      opacity: 0.8,
      marginTop: theme.spacing.xs,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.secondary,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
    modulesContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
    logoutButton: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.colors.secondary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Header
        title={theme.branding?.appName || 'Fibi'}
        showLogo={false}
        onMenuPress={() => {}}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            {dashboardData.overview?.headline ||
              `Welcome back, ${user?.firstName}! 👋`}
          </Text>
          <Text style={styles.userInfo}>
            {user?.department} • {user?.role}
          </Text>
          {dashboardData.overview && (
            <Text style={styles.overviewMeta}>
              {dashboardData.overview.activeGrants} active awards •{' '}
              {dashboardData.overview.pendingProposals} pending proposals •{' '}
              {dashboardData.overview.complianceTasks} compliance tasks
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>📊 Overview</Text>
        <View style={styles.statsContainer}>
          {resolvedStats?.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>🚀 Quick Access</Text>
        <View style={styles.modulesContainer}>
          {resolvedModules?.map((module) => (
            <ModuleCard
              key={module.id}
              name={module.name}
              description={module.description}
              icon={module.icon}
              badgeCount={module.badgeCount}
              accentColor={module.accentColor}
              onPress={() => console.log('Module:', module.id)}
            />
          ))}
        </View>

        <ActivityFeed activities={activities} />

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

