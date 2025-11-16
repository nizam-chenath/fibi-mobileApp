import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const AgreementStatusList = ({
  title = 'Agreement Counts by Status',
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
          <Text style={styles.stateText}>Loading agreement statuses…</Text>
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
          <Text style={styles.stateText}>No agreement data available</Text>
        </View>
      );
    }

    return items.map((item) => (
      <View key={item.code || item.label} style={styles.itemRow}>
        <View style={styles.itemLabelWrapper}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.code && <Text style={styles.itemCode}>#{item.code}</Text>}
        </View>
        <Text style={styles.itemValue}>{item.value}</Text>
      </View>
    ));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
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
      textAlign: 'center',
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
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    itemLabelWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    itemLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    itemCode: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    itemValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });

export default AgreementStatusList;


