// screens/EmailHubScreen.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import { stripHtmlTags } from '../utils/String.js';
import { fetchEmailNotifications, fetchEmailMessageTypes } from '../api/emailHubApi.js';
import { useSelector } from 'react-redux';

const EmailHubScreen = ({ onClose }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);
  const currentUniversityUid = useSelector((state) => state.tenant?.currentUniversityUid) || 'u100';
  const personId = useSelector((state) => state.user?.personId) || '10000000001';
  const [viewModalVisible, setViewModalVisible] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState(null);

  const formatToDDMMYY = React.useCallback((value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }, []);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [hasMore, setHasMore] = React.useState(true);
  const [sortBy, setSortBy] = React.useState('SEND_DATE');
  const [messageTypes, setMessageTypes] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const loadTypes = async () => {
      try {
        const res = await fetchEmailMessageTypes({
          uid: currentUniversityUid,
          person_id: personId,
        });
        if (!isMounted) return;
        const rows =
          Array.isArray(res)
            ? res
            : Array.isArray(res?.messageTypes?.messagetypes)
              ? res.messageTypes.messagetypes
              : [];
        const mapped = rows.map((t) => ({
          label: t?.message_type || t?.label || String(t?.notification_type_id || ''),
          value: t?.message_type || t?.label || String(t?.notification_type_id || ''),
          id: String(t?.notification_type_id || t?.message_type || Math.random()),
        }));
        setMessageTypes(mapped);
      } catch {
        // ignore types error for now
      }
    };
    loadTypes();
    return () => {
      isMounted = false;
    };
  }, [currentUniversityUid, personId]);

  const loadNotifications = React.useCallback(async (opts = {}) => {
    const targetPage = opts.page ?? page;
    const isLoadMore = targetPage > 1;
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }
      const res = await fetchEmailNotifications({
        uid: currentUniversityUid,
        person_id: personId,
        currentPage: targetPage,
        pageNumber: pageSize,
        sortBy,
        message_type: selectedType,
      });
      const items = Array.isArray(res?.entries)
        ? res.entries
        : Array.isArray(res)
          ? res
          : [];
      setNotifications((prev) => (isLoadMore ? [...prev, ...items] : items));
      const totalPages = Number(res?.pagination?.totalpages) || 0;
      setHasMore(totalPages ? targetPage < totalPages : items.length >= pageSize);
      setPage(targetPage);
    } catch (e) {
      setError(e.message || 'Failed to load notifications');
      setNotifications([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentUniversityUid, personId, page, pageSize, sortBy, selectedType]);

  React.useEffect(() => {
    // reset when filters change
    loadNotifications({ page: 1 });
  }, [sortBy, selectedType, currentUniversityUid, personId]);

  const renderItem = ({ item }) => {
    const rawDate = item.send_date || item.sendDate || item.date;
    const displayDate = rawDate ? formatToDDMMYY(rawDate) : (item.timeAgo || '');
    const cleanSubject = stripHtmlTags(item.subject || item.title || 'Notification');
    const cleanMessage = stripHtmlTags(item.message || '');
    return (
      <View style={[styles.card, item.isUnread ? styles.unreadCard : null]}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{cleanSubject}</Text>
          {!!displayDate && <Text style={styles.timeAgo}>{displayDate}</Text>}
        </View>
        {item.message_type ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{String(item.message_type)}</Text>
          </View>
        ) : null}
        {cleanMessage ? <Text style={styles.message} numberOfLines={1}>{cleanMessage}</Text> : null}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.9}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            onPress={() => {
              setSelectedNotification({
                subject: cleanSubject,
                message: cleanMessage,
                date: displayDate,
                raw: item,
              });
              setViewModalVisible(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="View full message"
          >
            <Icon name="eye-outline" size={14} color={'#000000'} />
            <Text style={[styles.viewButtonText, { color: '#000000' }]}>View</Text>
          </TouchableOpacity>
        </View>
  
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.85}>
          <Icon name="chevron-back" size={22} color={'#000000'} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Email Hub</Text>
        <TouchableOpacity
          onPress={() => loadNotifications({ page: 1 })}
          style={styles.refreshButton}
          activeOpacity={0.85}
        >
          <Icon name="refresh" size={18} color={'#000000'} />
        </TouchableOpacity>
      </View>

      <View>
        <View style={styles.dropdownRow}>
          {/* <Text style={styles.dropdownLabel}>Message Type</Text> */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownOpen((s) => !s)}
              activeOpacity={0.85}
            >
              <Text style={styles.dropdownValue}>
                {selectedType || 'Inbox'}
              </Text>
              <Icon name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={'#000000'} />
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={[styles.dropdownList, { backgroundColor: theme.colors.surface, borderColor: '#E5E7EB' }]}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedType(null);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Inbox</Text>
                </TouchableOpacity>
                {messageTypes.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedType(t.value);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading notifications…</Text>
        </View>
      )}
      {!!error && !loading && (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadNotifications({ page: 1 })}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && !error && (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => String(item.id || item.messageId || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (!loadingMore && hasMore) {
              loadNotifications({ page: page + 1 });
            }
          }}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
        />
      )}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setViewModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {selectedNotification && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={[styles.modalTitle, { color: theme.colors.text }]} numberOfLines={2}>
                        {selectedNotification.subject}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setViewModalVisible(false)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                      >
                        <Icon name="close" size={20} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    {!!selectedNotification.date && (
                      <Text style={[styles.modalSubTitle, { color: theme.colors.textSecondary }]}>
                        {selectedNotification.date}
                      </Text>
                    )}
                    <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 8 }}>
                      <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]} selectable>
                        {selectedNotification.message || ''}
                      </Text>
                    </ScrollView>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
      marginBottom: theme.spacing.md,
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#000000',
    },
    refreshButton: {
      padding: theme.spacing.sm,
    },
    dropdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: theme.spacing.md,
    },
    dropdownLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.colors.surface,
    },
    dropdownValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000000',
    },
    dropdownList: {
      marginTop: 6,
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
    },
    dropdownItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#00000014',
    },
    dropdownItemText: {
      fontSize: 14,
      color: '#000000',
    },
    listContent: {
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.md,
    },
    card: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    unreadCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000000',
      flex: 1,
      marginRight: 24,
    },
    timeAgo: {
      fontSize: 12,
      color: '#000000',
      marginLeft: 20,
    },
    message: {
      fontSize: 14,
      color: '#000000',
      marginTop: 6,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
    viewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: theme.colors.background,
    },
    viewButtonText: {
      fontSize: 12,
      fontWeight: '700',
    },
    pill: {
      alignSelf: 'flex-start',
      marginTop: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    pillText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    centerState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 24,
      gap: 8,
    },
    stateText: {
      fontSize: 14,
      color: '#000000',
    },
    retryButton: {
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    retryText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    modalContent: {
      width: '100%',
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 8,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    modalSubTitle: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 6,
      alignSelf: 'flex-end',
      textAlign: 'right',
    },
    modalScroll: {
      marginTop: 4,
    },
    modalMessage: {
      fontSize: 14,
      lineHeight: 22,
    },
  });

export default EmailHubScreen;


