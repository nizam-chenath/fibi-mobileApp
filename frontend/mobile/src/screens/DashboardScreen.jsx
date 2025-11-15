// screens/DashboardScreen.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import { getDashboardData } from '../mockData/dashboard.jsx';
import { getActivitiesByTenant } from '../mockData/activities.jsx';
import { fetchResearchSummaryWidget } from '../api/proposalsApi.js';
import { fetchActionInbox } from '../api/inboxApi.js';
import { fetchAgreementStatusCountWidget } from '../api/agreementsApi.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import AwardedProposalsChart from '../components/charts/AwardedProposalsChart.jsx';
import ProposalPerformanceSection from '../components/charts/ProposalPerformanceSection.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import ActionList from '../components/ActionList.jsx';
import AgreementStatusChart from '../components/AgreementStatusChart.jsx';
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
  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'agreements', label: 'Agreements' },
  ];
  const [activeDashboardTab, setActiveDashboardTab] = useState(dashboardTabs[0]?.id);

  const [activeModuleId, setActiveModuleId] = useState(
    resolvedModules?.[0]?.id,
  );
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [sponsorWidgetData, setSponsorWidgetData] = useState([]);
  const [widgetError, setWidgetError] = useState(null);
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [widgetPage, setWidgetPage] = useState(1);
  const [widgetHasMore, setWidgetHasMore] = useState(true);
  const [actions, setActions] = useState([]);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [actionsError, setActionsError] = useState(null);
  const [actionsRefreshKey, setActionsRefreshKey] = useState(0);
  const [agreementStatuses, setAgreementStatuses] = useState([]);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [agreementError, setAgreementError] = useState(null);
  const [agreementRefreshKey, setAgreementRefreshKey] = useState(0);

  useEffect(() => {
    if (resolvedModules?.length && !resolvedModules.find((m) => m.id === activeModuleId)) {
      setActiveModuleId(resolvedModules[0].id);
    }
  }, [resolvedModules, activeModuleId]);

  useEffect(() => {
    let isMounted = true;
    const loadWidgetData = async () => {
      try {
        setWidgetLoading(true);
        setWidgetError(null);
        const result = await fetchResearchSummaryWidget({
          unitNumber: dashboardData?.overview?.unitNumber || '000001',
          currentPage: widgetPage,
          pageNumber: 10,
        });
        if (isMounted) {
          const widgetRows = Array.isArray(result?.widgetDatas)
            ? result.widgetDatas.map((row, index) => ({
                id: `${row[0] || `sponsor-${widgetPage}-${index}`}`,
                label: row[1] || 'Unknown Sponsor',
                value: Number(row[2]) || 0,
              }))
            : [];
          setSponsorWidgetData((prev) =>
            widgetPage === 1 ? widgetRows : [...prev, ...widgetRows],
          );
          const totalItems = Number(result?.pageNumbers?.[0]?.totalCount);
          const loadedCount = (widgetPage - 1) * 10 + widgetRows.length;
          if (Number.isFinite(totalItems)) {
            setWidgetHasMore(loadedCount < totalItems);
          } else {
            setWidgetHasMore(widgetRows.length === 10);
          }
        }
      } catch (error) {
        if (isMounted) {
          setWidgetError(error.message || 'Failed to load sponsor data');
          setSponsorWidgetData((prev) => (widgetPage === 1 ? [] : prev));
          setWidgetHasMore(false);
        }
      } finally {
        if (isMounted) {
          setWidgetLoading(false);
        }
      }
    };

    loadWidgetData();
    return () => {
      isMounted = false;
    };
  }, [dashboardData?.overview?.unitNumber, widgetPage]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadActions = async () => {
      try {
        setActionsLoading(true);
        setActionsError(null);
        const preferredPersonId =
          user?.personId || user?.personID || user?.personIDNumber || '10000000001';
        const result = await fetchActionInbox({
          personId: preferredPersonId,
          signal: controller.signal,
        });
        if (isMounted) {
          setActions(result?.inboxDetails || []);
        }
      } catch (error) {
        if (!isMounted || error.name === 'AbortError') {
          return;
        }
        setActionsError(error.message || 'Failed to load actions');
      } finally {
        if (isMounted) {
          setActionsLoading(false);
        }
      }
    };

    loadActions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user?.personId, user?.personID, user?.personIDNumber, actionsRefreshKey]);

  useEffect(() => {
    let isMounted = true;
    const loadAgreementStatuses = async () => {
      try {
        setAgreementLoading(true);
        setAgreementError(null);
        const result = await fetchAgreementStatusCountWidget({
          unitNumber: dashboardData?.overview?.unitNumber || '000001',
        });

        if (!isMounted) {
          return;
        }

        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result?.widgetDatas)
            ? result.widgetDatas
            : [];

        const normalized = rows.map((row, index) => ({
          label: row?.[0] || `Status ${index + 1}`,
          code: row?.[1] || null,
          value: Number(row?.[2]) || 0,
        }));

        setAgreementStatuses(normalized);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setAgreementError(error.message || 'Failed to load agreement statuses');
      } finally {
        if (isMounted) {
          setAgreementLoading(false);
        }
      }
    };

    loadAgreementStatuses();
    return () => {
      isMounted = false;
    };
  }, [dashboardData?.overview?.unitNumber, agreementRefreshKey]);

  const handleSelectModule = (module) => {
    setActiveModuleId(module.id);
  };

  const handleLogoPress = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleShowProposals = useCallback(() => setActiveBottomTab('awards'), []);
  const handleReloadActions = useCallback(() => {
    setActionsRefreshKey((prev) => prev + 1);
  }, []);
  const handleReloadAgreementStatus = useCallback(() => {
    setAgreementRefreshKey((prev) => prev + 1);
  }, []);

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
    chartWrapper: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    bottomNavContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
    },
    showMoreButton: {
      marginTop: theme.spacing.sm,
      alignSelf: 'flex-end',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.primary + '55',
    },
    showMoreText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dashboardTabsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    tabToggle: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    tabButtonTextActive: {
      color: theme.colors.secondary,
    },
    tabRefreshButton: {
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tabPanel: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    actionListWrapper: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
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

        {/* {proposalInsights && (
          <ProposalPerformanceSection
            incomeLabel={proposalInsights.incomeLabel}
            incomeTotal={proposalInsights.incomeTotal}
            incomeSeries={proposalInsights.incomeSeries}
            donutLabel={computedDonutLabel}
            donutTotal={computedDonutTotal}
            donutSegments={computedDonutSegments}
          />
        )} */}

        <View style={styles.dashboardTabsWrapper}>
          <View style={styles.tabToggle}>
            {dashboardTabs.map((tab) => {
              const isActive = tab.id === activeDashboardTab;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveDashboardTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      isActive && styles.tabButtonTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* {activeDashboardTab === 'agreements' && (
            <TouchableOpacity
              style={styles.tabRefreshButton}
              onPress={handleReloadAgreementStatus}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="refresh" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          )} */}
        </View>

        {activeDashboardTab === 'agreements' ? (
          <AgreementStatusChart
            data={agreementStatuses}
            loading={agreementLoading}
            error={agreementError}
            onRetry={handleReloadAgreementStatus}
            containerStyle={styles.tabPanel}
            title="Agreement Status by Count"
            subtitle="Real-time counts by agreement state"
          />
        ) : (
          <>
            <View style={styles.chartWrapper}>
              <AwardedProposalsChart
                data={
                  sponsorWidgetData.length > 0
                    ? sponsorWidgetData.map((item, index) => ({
                        id: item.id,
                        label: item.label,
                        value: item.value,
                        color: chartFallbackPalette[index % chartFallbackPalette.length],
                      }))
                    : resolvedAwardedSponsors || []
                }
                subtitle={
                  widgetLoading
                    ? 'Loading sponsors...'
                    : sponsorWidgetData.length > 0
                      ? `${sponsorWidgetData.length} sponsors`
                      : `${dashboardData.awardedBySponsor?.length || 0} sponsors`
                }
                onShowMore={() => {
                  if (widgetHasMore && !widgetLoading) {
                    setWidgetPage((prev) => prev + 1);
                  }
                }}
              />
              {widgetHasMore && !widgetLoading && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setWidgetPage((prev) => prev + 1)}
                >
                  <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                    Show more sponsors
                  </Text>
                </TouchableOpacity>
              )}
              {widgetError && (
                <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
                  {widgetError}
                </Text>
              )}
            </View>

            <ActionList
              title="Action List"
              items={actions}
              loading={actionsLoading}
              error={actionsError}
              onRetry={handleReloadActions}
              containerStyle={styles.actionListWrapper}
            />
          </>
        )}

        {/* <ActivityFeed activities={activities} /> */}
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

