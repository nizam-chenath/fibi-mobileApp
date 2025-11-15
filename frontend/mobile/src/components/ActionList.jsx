import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

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
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

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

    return items.map((item) => (
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
      color: theme.colors.text,
    },
    stateWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    stateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
      color: theme.colors.primary,
    },
    itemCard: {
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
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
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
    },
    arrivalDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    itemSubtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
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
      color: theme.colors.textSecondary,
    },
  });

export default ActionList;


