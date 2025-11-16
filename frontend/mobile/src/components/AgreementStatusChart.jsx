import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const AgreementStatusChart = ({
  title = 'Agreement Status Overview',
  subtitle = null,
  data,
  loading,
  error,
  onRetry,
  containerStyle,
  initialVisibleCount = 5,
  showMoreLabel = 'Show more',
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const safeData = Array.isArray(data) ? data : [];
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [initialVisibleCount, safeData.length]);

  useEffect(() => {
    setVisibleCount((prev) => Math.min(Math.max(prev, initialVisibleCount), safeData.length || initialVisibleCount));
  }, [safeData, initialVisibleCount]);

  const displayedData = useMemo(
    () => safeData.slice(0, Math.max(0, visibleCount)),
    [safeData, visibleCount],
  );
  const hasMore = safeData.length > displayedData.length;

  const maxValue = useMemo(() => {
    if (!displayedData.length) {
      return 1;
    }
    return (
      displayedData.reduce((max, item) => Math.max(max, Number(item.value) || 0), 0) || 1
    );
  }, [displayedData]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateWrapper}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading agreement statuses…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name='warning-outline' size={20} color={theme.colors.error} />
          <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!displayedData.length) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name='information-circle-outline' size={22} color={theme.colors.textSecondary} />
          <Text style={styles.stateText}>No agreement status data available</Text>
        </View>
      );
    }

    return (
      <>
        {displayedData.map((item) => {
          const percentage = ((Number(item.value) || 0) / maxValue) * 100;
          return (
            <View key={`${item.code || item.label}`} style={styles.row}>
              <View style={styles.labelGroup}>
                <Text style={styles.labelText}>{item.label || 'Status'}</Text>
                {item.code ? <Text style={styles.codeText}>#{item.code}</Text> : null}
              </View>
              <View style={styles.barGroup}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.max(8, Math.min(100, percentage))}%` },
                    ]}
                  />
                </View>
                <Text style={styles.valueText}>{item.value ?? 0}</Text>
              </View>
            </View>
          );
        })}
        {hasMore && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setVisibleCount(safeData.length)}
          >
            <Text style={styles.showMoreText}>{showMoreLabel}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onRetry && !loading && (
          <TouchableOpacity onPress={onRetry} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name='refresh' size={18} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
      {renderContent()}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    card: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
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
    subtitle: {
      fontSize: 13,
      color: '#000000',
      marginTop: 4,
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
      textAlign: 'center',
    },
    retryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: '#48BD92',
    },
    retryText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
    },
    row: {
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
      gap: theme.spacing.sm,
    },
    labelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    labelText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#000000',
      flexShrink: 1,
    },
    codeText: {
      fontSize: 12,
      color: '#000000',
    },
    barGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    barTrack: {
      flex: 1,
      height: 12,
      backgroundColor: '#cccccc',
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
    },
    valueText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary,
      minWidth: 24,
      textAlign: 'right',
    },
    showMoreButton: {
      marginTop: theme.spacing.md,
      alignSelf: 'flex-end',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: '#000000' + '55',
    },
    showMoreText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
    },
  });

export default AgreementStatusChart;


