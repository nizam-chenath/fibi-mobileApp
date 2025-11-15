import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const NotificationList = ({ visible, notifications = [], onClose }) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-start',
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 70,
        },
        panel: {
          backgroundColor: theme.colors.surface || '#fff',
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 10,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        },
        headerTitle: {
          fontSize: 16,
          fontWeight: '700',
          color: theme.colors.textPrimary || '#111',
        },
        closeButton: {
          padding: theme.spacing.xs,
        },
        emptyState: {
          paddingVertical: theme.spacing.lg,
          alignItems: 'center',
        },
        emptyText: {
          color: theme.colors.textMuted || '#666',
        },
        notificationCard: {
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.sm,
          marginBottom: theme.spacing.xs,
          backgroundColor: theme.colors.background || '#f7f7f7',
        },
        unreadCard: {
          borderWidth: 1,
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primaryLight || 'rgba(39,84,193,0.12)',
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        title: {
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.textPrimary || '#111',
          flex: 1,
          marginRight: theme.spacing.xs,
        },
        timeAgo: {
          fontSize: 12,
          color: theme.colors.textMuted || '#666',
        },
        message: {
          marginTop: 4,
          fontSize: 13,
          color: theme.colors.textSecondary || '#333',
        },
        source: {
          marginTop: 6,
          fontSize: 12,
          fontWeight: '600',
          color: theme.colors.primary,
        },
      }),
    [theme],
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.notificationCard,
        item.isUnread ? styles.unreadCard : null,
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.timeAgo}>{item.timeAgo || item.timestamp}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      {item.source ? <Text style={styles.source}>{item.source}</Text> : null}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.panel}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Icon name="close" size={20} color={theme.colors.textPrimary || '#111'} />
                </TouchableOpacity>
              </View>
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>You’re all caught up!</Text>
                </View>
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotificationList;

