// screens/DashboardScreen.jsx
import React, { useMemo, useState, useEffect } from 'react';
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
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StatsCard from '../components/StatsCard.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import AwardedProposalsChart from '../components/charts/AwardedProposalsChart.jsx';
import ProposalPerformanceSection from '../components/charts/ProposalPerformanceSection.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import ServiceTrackerScreen from './ServiceTrackerScreen.jsx';
import AwardsScreen from './AwardsScreen.jsx';
import NotificationList from '../components/NotificationList.jsx';

const DashboardScreen = ({ onLogout }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const tenantId = useSelector((state) => state.tenant.currentTenantId);
  const dashboardData = getDashboardData(tenantId, user?.role);
  const activities = getActivitiesByTenant(tenantId);
  const proposalInsights = dashboardData?.proposalInsights;

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

  const chartFallbackPalette = ['#2754C1', '#EA5A2B', '#F4B33F', '#7AC29A', '#A45CE6'];
  const resolvedAwardedSponsors = dashboardData.awardedBySponsor?.map(
    (sponsor, index) => ({
      ...sponsor,
      color:
        theme.colors[sponsor.colorToken] ||
        sponsor.color ||
        chartFallbackPalette[index % chartFallbackPalette.length],
    }),
  );
  const sponsorDonutSegments = useMemo(
    () =>
      resolvedAwardedSponsors?.map((sponsor) => ({
        id: sponsor.id,
        value: sponsor.value,
        color: sponsor.color,
      })) || [],
    [resolvedAwardedSponsors],
  );

  const hasSponsorSegments = sponsorDonutSegments.length > 0;

  const computedDonutTotal = hasSponsorSegments
    ? sponsorDonutSegments.reduce((sum, seg) => sum + (seg.value || 0), 0)
    : proposalInsights?.donutTotal || 0;

  const computedDonutSegments =
    hasSponsorSegments ? sponsorDonutSegments : proposalInsights?.donutSegments || [];

  const computedDonutLabel =
    (hasSponsorSegments ? 'Awarded Sponsors' : proposalInsights?.donutLabel) ||
    'Awarded Sponsors';

  const notifications = dashboardData.notifications?.items || [];
  const notificationCount = notifications.length > 0 ? 1 : 0;
  const bottomTabs = [
    { id: 'home', label: 'Dashboard', icon: 'home-outline' },
    { id: 'service', label: 'Tracker', icon: 'construct-outline' },
    { id: 'awards', label: 'Awards', icon: 'trophy-outline' },
  ];
  const [activeBottomTab, setActiveBottomTab] = useState(bottomTabs[0]?.id);

  const [activeModuleId, setActiveModuleId] = useState(
    resolvedModules?.[0]?.id,
  );
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  useEffect(() => {
    if (resolvedModules?.length && !resolvedModules.find((m) => m.id === activeModuleId)) {
      setActiveModuleId(resolvedModules[0].id);
    }
  }, [resolvedModules, activeModuleId]);

  const handleSelectModule = (module) => {
    setActiveModuleId(module.id);
  };

  const handleLogoPress = () => {
    setSidebarVisible((prev) => !prev);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    shell: {
      flex: 1,
      flexDirection: 'row',
    },
    sidebarWrapper: {
      backgroundColor: theme.colors.surface,
    },
    contentArea: {
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
    chartWrapper: {
      marginTop: theme.spacing.lg,
    },
    modulesContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
    bottomNavContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
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

  const renderMainSection = () => {
    if (activeBottomTab === 'service') {
      return <ServiceTrackerScreen />;
    }
    if (activeBottomTab === 'awards') {
      return <AwardsScreen />;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.welcomeSection}> ... </View> */}

        {proposalInsights && (
          <ProposalPerformanceSection
            incomeLabel={proposalInsights.incomeLabel}
            incomeTotal={proposalInsights.incomeTotal}
            incomeSeries={proposalInsights.incomeSeries}
            donutLabel={computedDonutLabel}
            donutTotal={computedDonutTotal}
            donutSegments={computedDonutSegments}
          />
        )}

        {resolvedAwardedSponsors?.length > 0 && (
          <View style={styles.chartWrapper}>
            <AwardedProposalsChart
              data={resolvedAwardedSponsors}
              subtitle={`${dashboardData.awardedBySponsor?.length || 0} sponsors`}
              onShowMore={() => console.log('Navigate to awarded sponsors detail')}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Overview</Text>
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
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar
        title={theme.branding?.appName || 'Fibi'}
        user={user}
        tenantLogo={theme.branding?.logo}
        onLogout={onLogout}
        onSidebarToggle={handleLogoPress}
        notificationCount={notificationCount}
        onNotificationPress={() => setNotificationsVisible(true)}
      />
      <View style={styles.shell}>
        {sidebarVisible && (
          <Sidebar
            modules={resolvedModules || []}
            activeModuleId={activeModuleId}
            onSelectModule={handleSelectModule}
            user={user}
            onLogout={onLogout}
            onClose={() => setSidebarVisible(false)}
          />
        )}
        <View style={styles.contentArea}>
          {renderMainSection()}
          <View style={styles.bottomNavContainer}>
            <BottomNavBar
              tabs={bottomTabs}
              activeTab={activeBottomTab}
              onTabPress={(tab) => {
                setActiveBottomTab(tab.id);
                console.log('Bottom tab pressed:', tab.id);
              }}
            />
          </View>
        </View>
      </View>
      <NotificationList
        visible={notificationsVisible}
        notifications={notifications}
        onClose={() => setNotificationsVisible(false)}
      />
    </View>
  );
};

export default DashboardScreen;

