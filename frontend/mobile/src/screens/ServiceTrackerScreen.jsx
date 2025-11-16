// screens/ServiceTrackerScreen.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import { fetchServiceTrackerData } from '../services/serviceTrackerService.js';

const initialPayload = {
  pageNumber: 1,
  pageLimit: 20,
  sortBy: '',
  tabId: 1,
  moduleCode: 20,
  tabKey: 'MY_REQUEST',
  currentFilter: {
    filterId: 265,
    filterName: 'Admin correction requests',
    criterias: [
      {
        criteriaId: 4,
        criteriaKey: 'CRT_SR_TYPE',
        sortOrder: 4,
        value: {
          value: null,
          values: ['6'],
          fromDate: null,
          toDate: null,
          displayValue: null,
          isEmp: null,
        },
      },
    ],
    columns: [
      { columnId: 1, columnKey: 'COL_SR_ID', sortOrder: 1 },
      { columnId: 2, columnKey: 'COL_SR_SUBJECT', sortOrder: 2 },
      { columnId: 3, columnKey: 'COL_SR_CATEGORY', sortOrder: 3 },
      { columnId: 4, columnKey: 'COL_SR_TYPE', sortOrder: 4 },
      { columnId: 5, columnKey: 'COL_SR_PRIORITY', sortOrder: 5 },
      { columnId: 6, columnKey: 'COL_SR_DEPARTMENT', sortOrder: 6 },
      { columnId: 7, columnKey: 'COL_SR_STATUS', sortOrder: 7 },
      { columnId: 8, columnKey: 'COL_SR_ADMIN_GROUP', sortOrder: 8 },
      { columnId: 9, columnKey: 'COL_SR_ASSI_PERSON', sortOrder: 9 },
      { columnId: 10, columnKey: 'COL_SR_CREATE_DATE', sortOrder: 10 },
    ],
  },
};

const ServiceTrackerScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  // UI states: search, sort, status filter, selected item
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createDate', direction: 'desc' });
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const sortOptions = [
    { key: 'createDate', label: 'Created' },
    { key: 'priority', label: 'Priority' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchServiceTrackerData();
        console.log('[ServiceTrackerScreen] Response object:', res);
        const list = res?.dashboardList || [];
        console.log('[ServiceTrackerScreen] Items received:', Array.isArray(list) ? list.length : 'n/a');
        setRawData(list);
      } catch (err) {
        console.error('[ServiceTrackerScreen] Load failed:', err?.message || err);
        setError(err.message || 'Failed to load data');
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapRequest = (item) => {
    // normalize fields we use in the UI
    return {
      id: (item.COL_SR_ID || item.serviceRequestId || '—').toString(),
      title: (item.COL_SR_SUBJECT || item.subject || 'Untitled Request').trim(),
      type: item.COL_SR_TYPE || item.type || '—',
      category: item.COL_SR_CATEGORY || item.category || '—',
      priority: item.COL_SR_PRIORITY || item.priority || '—',
      status: item.COL_SR_STATUS || item.status || '—',
      assignee: item.COL_SR_ASSI_PERSON || item.assignee || 'Unassigned',
      department: item.COL_SR_DEPARTMENT || item.department || '-',
      createDate: Number(item.COL_SR_CREATE_DATE) || Number(item.createDate) || 0,
      raw: item,
    };
  };

  const mapped = useMemo(() => (rawData || []).map(mapRequest), [rawData]);

  const statuses = useMemo(() => {
    const s = Array.from(new Set((mapped || []).map(d => d.status).filter(Boolean)));
    return ['All', ...s];
  }, [mapped]);

  const filteredData = useMemo(() => {
    let list = mapped || [];
    if (selectedStatus && selectedStatus !== 'All') {
      list = list.filter((d) => d.status === selectedStatus);
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.assignee.toLowerCase().includes(q),
      );
    }
    const { key, direction } = sortConfig;
    list = [...list].sort((a, b) => {
      const aVal = a[key] ?? '';
      const bVal = b[key] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') return direction === 'asc' ? aVal - bVal : bVal - aVal;
      return direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [mapped, selectedStatus, searchQuery, sortConfig]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item.raw)} activeOpacity={0.9}>
      <View
        style={[
          styles.proposalCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.proposalId, { color: '#000000' }]}>Request #{item.id}</Text>
            <Text style={[styles.proposalTitle, { color: '#000000' }]} numberOfLines={2}>{item.title}</Text>
          </View>
          {!!(item.status && String(item.status).trim()) && (
            <View style={styles.badgeColumn}>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor(item.status)}26` }]}> 
                <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: '#000000' }]}>Category</Text>
            <Text style={[styles.metaValue, { color: '#000000' }]}>{item.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: '#000000' }]}>Priority</Text>
            <Text style={[styles.metaValue, { color: '#000000' }]}>{item.priority}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: '#000000' }]}>Department</Text>
            <Text style={[styles.metaValue, { color: '#000000' }]}>{item.department}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerPill}>
            <Icon name="person-outline" size={14} />
            <Text style={[styles.footerText, { color: '#000000' }]}>{item.assignee}</Text>
          </View>
          <View style={styles.footerPill}>
            <Icon name="time-outline" size={14} />
            <Text style={[styles.footerText, { color: '#000000' }]}>{formatDate(item.createDate)}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.viewButton,
              { borderColor: '#E5E7EB', backgroundColor: theme.colors.background },
            ]}
            activeOpacity={0.9}
            onPress={() => setSelectedItem(item.raw)}
          >
            <Icon name="eye-outline" size={14} color={'#000000'} />
            <Text style={[styles.viewButtonText, { color: '#000000' }]}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatDate = (ts) => {
    if (!ts) return '';
    // ts may be milliseconds with decimals
    const n = Math.floor(Number(ts));
    const d = new Date(n);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const PriorityBadge = ({ priority }) => {
    const p = (priority || '').toString().toLowerCase();
    let bg = '#4caf50'; // default green
    if (p.includes('high')) bg = '#7b1fa2'; // purple (requested)
    else if (p.includes('medium') || p.includes('med')) bg = '#fb8c00'; // orange
    else if (p.includes('low')) bg = '#8bc34a';
    return (
      <View style={[styles.priorityBadge, { backgroundColor: bg }]}>
        <Text style={styles.priorityBadgeText}>{priority}</Text>
      </View>
    );
  };

  const statusColor = (status) => {
    if (!status) return '#9e9e9e';
    const s = status.toString().toLowerCase();
    if (s.includes('inactive') || s.includes('closed')) return '#9e9e9e';
    if (s.includes('review')) return '#1e88e5'; // blue
    if (s.includes('approval')) return '#7b1fa2'; // purple
    if (s.includes('in progress')) return '#ffa726'; // orange
    return '#607d8b';
  };

  const renderField = (label, value) => (
    <View key={label} style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</Text>
    </View>
  );

  const toggleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: 'asc' };
    });
  }, []);

  const getStatusTone = (status) => {
    const lowered = (status || '').toLowerCase();
    if (lowered.includes('closed') || lowered.includes('complete') || lowered.includes('resolved')) return theme.colors.success || '#22c55e';
    if (lowered.includes('review') || lowered.includes('progress') || lowered.includes('in progress')) return theme.colors.warning || '#f59e0b';
    return theme.colors.error || '#7b1fa2';
  };

  const heroTextColor = theme.colors.text || '#0f172a';
  const heroMutedColor = theme.colors.textSecondary || 'rgba(15,23,42,0.65)';
  const heroBorderColor = theme.colors.border || 'rgba(15,23,42,0.2)';

  const activeSortLabel = sortConfig.key === 'createDate' ? 'Created' : sortConfig.key;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: '#000000' }]}>Service Tracker</Text>
      <Text style={[styles.subtitle, { color: '#000000' }]}>Track service requests, priorities and assignment in one place.</Text>

      <View style={[styles.searchRow, { marginBottom: 12 }]}> 
        <TextInput
          style={[styles.searchInput, { borderColor: '#E5E7EB', backgroundColor: theme.colors.surface, color: '#000000' }]}
          placeholder="Search requests"
          placeholderTextColor={'#000000'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.sortControls}>
        <TouchableOpacity
          style={[styles.dropdownButton, { borderColor: '#E5E7EB', backgroundColor: theme.colors.surface }]}
          onPress={() => setSortMenuVisible(true)}
          activeOpacity={0.85}
        >
          <View>
            <Text style={[styles.dropdownLabel, { color: '#000000' }]}>Sort by</Text>
            <Text style={[styles.dropdownValue, { color: '#000000' }]}>{activeSortLabel}</Text>
          </View>
          <Icon name="chevron-down" size={16} color={'#000000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dropdownButton, { borderColor: '#E5E7EB', backgroundColor: theme.colors.surface, marginLeft: 8 }]}
          onPress={() => setStatusMenuVisible(true)}
          activeOpacity={0.85}
        >
          <View>
            <Text style={[styles.dropdownLabel, { color: '#000000' }]}>Status</Text>
            <Text style={[styles.dropdownValue, { color: '#000000' }]}>{selectedStatus}</Text>
          </View>
          <Icon name="chevron-down" size={16} color={'#000000'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.clearButton, { borderColor: '#E5E7EB' }]} onPress={() => { setSortConfig({ key: 'createDate', direction: 'desc' }); setSearchQuery(''); setSelectedStatus('All'); }} activeOpacity={0.8}>
          <Icon name="close-circle-outline" size={16} color={'#000000'} />
          <Text style={[styles.clearText, { color: '#000000' }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Status dropdown modal */}
      <Modal visible={statusMenuVisible} transparent animationType="fade" onRequestClose={() => setStatusMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setStatusMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.dropdownList, { backgroundColor: theme.colors.surface, borderColor: '#E5E7EB' }]}>
                {(() => {
                  const preset = ['All', 'Inactive', 'Review In Progress', 'Approval In Progress', 'In Progress'];
                  const combined = Array.from(new Set([...preset, ...(statuses || [])]));
                  return combined.map((opt) => {
                    const isActive = opt === selectedStatus;
                    return (
                      <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setSelectedStatus(opt); setStatusMenuVisible(false); }}>
                        <Text style={[styles.dropdownItemLabel, { color: '#000000' }]}>{opt}</Text>
                        {isActive && <Icon name={sortConfig.direction === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline'} size={16} color={'#000000'} />}
                      </TouchableOpacity>
                    );
                  });
                })()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* status chips removed — dropdown filter is used instead */}

      {loading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 8 }} />}
      {error && <Text style={[styles.subtitle, { color: '#000000' }]}>{error}</Text>}

      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {!loading && !error && filteredData.length === 0 && (
          <Text style={[styles.subtitle, { color: '#000000' }]}>No requests found.</Text>
        )}
        {!loading && !error && filteredData.map((it) => (
          <View key={it.id} style={[styles.proposalCard, { backgroundColor: theme.colors.surface, borderColor: '#E5E7EB' }]}>
            {renderItem({ item: it })}
          </View>
        ))}
      </ScrollView>

      {/* Sort options modal */}
      <Modal visible={sortMenuVisible} transparent animationType="fade" onRequestClose={() => setSortMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setSortMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.dropdownList, { backgroundColor: theme.colors.surface, borderColor: '#E5E7EB' }]}>
                {sortOptions.map((option) => {
                  const isActive = option.key === sortConfig.key;
                  return (
                    <TouchableOpacity key={option.key} style={styles.dropdownItem} onPress={() => { setSortConfig((prev) => ({ key: option.key, direction: prev.key === option.key ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc' })); setSortMenuVisible(false); }}>
                      <Text style={[styles.dropdownItemLabel, { color: '#000000', fontWeight: isActive ? '700' : '500' }]}>{option.label}</Text>
                      {isActive && (
                        <Icon name={sortConfig.direction === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline'} size={16} color={'#000000'} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Detail modal - aligned with AwardsScreen modal design */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.surface, borderColor: '#00000033' },
                ]}
              >
                {selectedItem && (
                  <>
                    <Text style={[styles.modalTitle]}>
                      Request #{selectedItem?.serviceRequestId || selectedItem?.COL_SR_ID || selectedItem?.id}
                    </Text>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Subject
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_SUBJECT || selectedItem?.subject || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Status
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_STATUS || selectedItem?.status || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Priority
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_PRIORITY || selectedItem?.priority || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Type
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_TYPE || selectedItem?.type || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Category
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_CATEGORY || selectedItem?.category || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Department
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_DEPARTMENT || selectedItem?.department || '—'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Assigned To
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {selectedItem?.COL_SR_ASSI_PERSON || selectedItem?.assignee || 'Unassigned'}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel]}>
                        Created
                      </Text>
                      <Text style={[styles.modalValue]}>
                        {formatDate(selectedItem?.COL_SR_CREATE_DATE || selectedItem?.createDate)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.modalCloseButton,
                        { borderColor: '#00000033' },
                      ]}
                      onPress={() => setSelectedItem(null)}
                      activeOpacity={0.9}
                    >
                      <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>Close</Text>
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 2,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 2,
  },
  cellSmall: {
    fontSize: 12,
    paddingHorizontal: 2,
  },
  viewToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  toggleBtnActive: {
    backgroundColor: '#eee',
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#111',
    fontWeight: '700',
  },
  cardItem: {
    width: '100%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardId: {
    fontWeight: '700',
  },
  cardSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
  },
  priorityCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  filterBar: {
    flexDirection: 'row',
    marginVertical: 8,
    flexWrap: 'nowrap',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#007aff',
  },
  chipText: {
    color: '#333',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  modalWrapper: {
    flex: 1,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalId: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 4,
    flexShrink: 1,
  },
  headerBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  closeBtn: {
    marginTop: 6,
  },
  modalBody: {
    flex: 1,
  },
  metaChipsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaChip: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  metaChipText: {
    color: '#0b66ff',
    fontWeight: '700',
  },
  detailGrid: {
    marginTop: 8,
  },
  fieldRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 14,
    color: '#000000',
  },
  /* Proposal-like card styles */
  cardList: {
    paddingBottom: 32,
    gap: 12,
  },
  proposalCard: {
    borderRadius: 18,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  proposalId: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
    fontWeight: '600',
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  typeBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flex: 1,
    minWidth: 140,
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 'auto',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchRow: {
    marginBottom: 12,
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  dropdownLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
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
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalRow: {
    gap: 2,
  },
  modalLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dropdownList: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemLabel: {
    fontSize: 14,
  },
  detailCard: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
});

export default ServiceTrackerScreen;


