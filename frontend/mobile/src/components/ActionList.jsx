import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const inferStatus = (item = {}) => {
  const normalizedStatus = String(
    item.status ||
      item.actionStatus ||
      item.messageStatus ||
      item?.message?.status ||
      item?.message?.descriptionStatus ||
      '',
  ).toLowerCase();

  if (
    item.openedFlag === 'Y' ||
    item.processedFlag === 'Y' ||
    item.actionProcessedFlag === 'Y' ||
    ['processed', 'complete', 'completed', 'done'].includes(normalizedStatus)
  ) {
    return 'processed';
  }

  if (
    item.openedFlag === 'N' ||
    ['pending', 'new', 'open', 'action required'].includes(normalizedStatus)
  ) {
    return 'pending';
  }

  return 'pending';
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'No date';
  }
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ActionList = ({
  title = 'Action Items',
  items,
  loading,
  error,
  onRetry,
  showHeader = true,
  containerStyle,
  onShowMore,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [statusFilter, setStatusFilter] = useState('pending');

  const statusCounts = useMemo(() => {
    return (items || []).reduce(
      (acc, item) => {
        const status = inferStatus(item);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { pending: 0, processed: 0 },
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }
    return items.filter((item) => inferStatus(item) === statusFilter);
  }, [items, statusFilter]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateWrapper}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Text style={styles.stateText}>Loading actions…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name="warning-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!items || items.length === 0) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name="checkmark-circle-outline" size={22} color={theme.colors.success} />
          <Text style={styles.stateText}>You’re all caught up!</Text>
        </View>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <>
          <View style={styles.stateWrapper}>
            <Icon name="filter-circle-outline" size={22} color="#000000" />
            <Text style={styles.stateText}>
              {statusFilter === 'pending'
                ? 'No pending actions right now'
                : 'No processed actions to review'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={onShowMore}
            activeOpacity={0.9}
          >
            <Text style={styles.showMoreText}>View more</Text>
          </TouchableOpacity>
        </>
      );
    }

    const visibleItems = filteredItems.slice(0, 5);

    const listNodes = visibleItems.map((item) => (
      <View key={item.inboxId} style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.moduleBadge}>{item?.moduleName?.description || 'Module'}</Text>
          <Text style={styles.arrivalDate}>{formatTimestamp(item.arrivalDate)}</Text>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.message?.description || 'Action Required'}
        </Text>
        <Text style={styles.itemSubtitle} numberOfLines={3}>
          {item.userMessage || 'Tap to view details'}
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.metaGroup}>
          <Icon name="person-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>
              {item.subjectType === 'R' ? 'Research' : item.subjectType === 'P' ? 'Proposal' : 'General'}
            </Text>
          </View>
        </View>
      </View>
    ));

    return (
      <>
        {listNodes}
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={onShowMore}
          activeOpacity={0.9}
        >
          <Text style={styles.showMoreText}>View more</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="refresh" size={18} color={theme.colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {items?.length ? (
        <View style={styles.filterBar}>
          {['pending', 'processed'].map((filterKey) => {
            const isActive = statusFilter === filterKey;
            return (
              <TouchableOpacity
                key={filterKey}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => setStatusFilter(filterKey)}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    isActive && { color: '#000000', fontWeight: '700' },
                  ]}
                >
                  {filterKey === 'pending' ? 'Pending' : 'Processed'}
                </Text>
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {statusCounts[filterKey] || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
      {renderContent()}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#000000',
    },
    stateWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    stateText: {
      fontSize: 14,
      color: '#000000',
    },
    retryButton: {
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
    },
    retryText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
    },
    filterBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.mutedBackground || theme.colors.surfaceAlt || '#F4F4F5',
      borderRadius: theme.borderRadius.full,
      padding: 4,
      marginBottom: theme.spacing.md,
      gap: 4,
    },
    filterButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary + '15',
    },
    filterLabel: {
      fontSize: 13,
      color: '#000000',
    },
    filterBadge: {
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    filterBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
    },
    itemCard: {
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    moduleBadge: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
      backgroundColor: '#00000015',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
    },
    arrivalDate: {
      fontSize: 12,
      color: '#000000',
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#000000',
      marginBottom: 4,
    },
    itemSubtitle: {
      fontSize: 13,
      color: '#000000',
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.sm,
    },
    metaGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: '#000000',
    },
    showMoreButton: {
      alignSelf: 'center',
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.primary + '55',
    },
    showMoreText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });

export default ActionList;


