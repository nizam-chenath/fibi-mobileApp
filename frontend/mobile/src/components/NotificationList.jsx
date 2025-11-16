import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../hooks/useAuth.jsx';
import { fetchActionInboxList } from '../api/inboxApi.js';
import { useNotificationSocket } from '../context/NotificationSocketContext.jsx';

const NotificationList = ({ onBack }) => {
  const { user } = useAuth();
  const { markAllRead } = useNotificationSocket();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  const formatDateTime = React.useCallback((value) => {
    if (!value) return '';
    const date = new Date(Number(value));
    if (Number.isNaN(date.getTime())) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yy}/ ${hh}:${min}`;
  }, []);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications],
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        },
        backButton: {
          padding: 8,
          marginRight: 8,
        },
        screenTitle: {
          fontSize: 20,
          fontWeight: '700',
          color: '#000000',
          marginRight: 8,
        },
        listContent: {
          paddingBottom: 32,
        },
        emptyState: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        },
        emptyText: {
          fontSize: 14,
          color: '#000000',
        },
        notificationCard: {
          borderRadius: 10,
          padding: 10,
          marginBottom: 8,
          backgroundColor: '#FFFFFF',
        },
        unreadCard: {
          borderColor: '#D1D5DB',
          backgroundColor: '#FFFFFF',
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
        },
        badge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: '#F3F4F6',
          maxWidth: '75%',
        },
        badgeText: {
          fontSize: 12,
          fontWeight: '600',
          color: '#111827',
        },
        headerBadge: {
          minWidth: 22,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 999,
          backgroundColor: '#ef4444',
          alignItems: 'center',
          justifyContent: 'center',
        },
        headerBadgeText: {
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
        },
        title: {
          fontSize: 14,
          fontWeight: '600',
          color: '#000000',
          flex: 1,
          marginRight: 6,
        },
        timeAgo: {
          fontSize: 12,
          color: '#000000',
        },
        message: {
          marginTop: 4,
          fontSize: 13,
          color: '#000000',
        },
      }),
    [],
  );

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const preferredPersonId =
          user?.personId || user?.personID || user?.personIDNumber;
        const data = await fetchActionInboxList({
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
          timestamp: formatDateTime(row?.arrivalDate),
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
  }, [user?.personId, user?.personID, user?.personIDNumber, formatDateTime]);

  // When the notification list screen is opened, mark all socket notifications as read
  React.useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.notificationCard,
        item.isUnread ? styles.unreadCard : null,
      ]}
    >
      {/* Row 1: Title */}
      <Text style={styles.title}>{item.title}</Text>
      {/* Row 2: User message */}
      <Text style={styles.message}>{item.message}</Text>
      {/* Row 3: Badge (module description) and date/time */}
      <View style={styles.titleRow}>
        {item.source ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.source}</Text>
          </View>
        ) : <View style={{ width: 8 }} />}
        <Text style={styles.timeAgo}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={22} color={'#000000'} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.screenTitle}>Action List</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color="#2754C1" />
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Icon name="warning-outline" size={24} color="#ef4444" />
          <Text style={[styles.emptyText, { color: '#ef4444' }]}>{error}</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="checkmark-circle-outline" size={36} color="#22c55e" />
          <Text style={styles.emptyText}>You’re all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default NotificationList;