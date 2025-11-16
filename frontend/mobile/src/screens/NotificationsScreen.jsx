import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const NotificationsScreen = ({ notifications = [], onClose }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

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
        <View>
          <Text style={styles.screenTitle}>Notifications</Text>
          <Text style={styles.subtitle}>
            {notifications.length > 0
              ? `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`
              : 'No new notifications'}
          </Text>
        </View>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
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
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
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


