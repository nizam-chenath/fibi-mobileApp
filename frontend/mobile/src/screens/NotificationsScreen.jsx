import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import { fetchActionInboxPage } from '../api/inboxApi.js';

const NotificationsScreen = ({ onClose }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const preferredPersonId =
          user?.personId || user?.personID || user?.personIDNumber || '10000000001';
        const data = await fetchActionInboxPage({
          personId: preferredPersonId,
          currentPage: 1,
          itemsPerPage: 50,
          isViewAll: 'N',
          processed: false,
          signal: controller.signal,
        });
        if (!isMounted) return;
        const rows = Array.isArray(data?.inboxDetails) ? data.inboxDetails : [];
        const mapped = rows.map((row) => ({
          id: String(row.inboxId ?? `${row.moduleCode || 'mod'}-${row.moduleItemKey || 'item'}`),
          title: row?.message?.description || 'Notification',
          message: row?.userMessage || '',
          source: row?.moduleName?.description || '',
          timestamp: row?.arrivalDate ? new Date(Number(row.arrivalDate)).toLocaleString() : '',
          isUnread: row.openedFlag === 'N',
        }));
        setNotifications(mapped);
      } catch (e) {
        if (e.name === 'AbortError') return;
        if (isMounted) {
          setError(e.message || 'Failed to load notifications');
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user?.personId, user?.personID, user?.personIDNumber]);

  const renderNotification = (item) => (
    <View
      key={item.id}
      style={[styles.card, item.isUnread ? styles.unreadCard : null]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title || 'Notification'}</Text>
        <Text style={styles.timeAgo}>{item.timeAgo || item.timestamp || ''}</Text>
      </View>
      {item.message ? <Text style={styles.message}>{item.message}</Text> : null}
      {item.source ? <Text style={styles.source}>{item.source}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.8}>
          <Icon name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.screenTitle}>Notification Hub</Text>
          <Text style={styles.subtitle}>
            {loading
              ? 'Loading notifications...'
              : notifications.length > 0
                ? `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`
                : 'No new notifications'}
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Icon name="warning-outline" size={24} color={theme.colors.error} />
          <Text style={[styles.emptyText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="checkmark-circle-outline" size={36} color={theme.colors.success} />
          <Text style={styles.emptyText}>You’re all caught up!</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map(renderNotification)}
        </ScrollView>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    listContent: {
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    card: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    unreadCard: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    timeAgo: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    message: {
      marginTop: theme.spacing.xs,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    source: {
      marginTop: theme.spacing.sm,
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });

export default NotificationsScreen;


