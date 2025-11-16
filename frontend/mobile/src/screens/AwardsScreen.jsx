// screens/AwardsScreen.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme.jsx';
import { fetchProposalsDashboard } from '../api/proposalsApi.js';
import { stripHtmlTags } from '../utils/String.js';

const proposalTabs = [
  { id: 'my', label: 'My Proposals' },
  { id: 'all', label: 'All Proposals' },
  { id: 'inProgress', label: 'Review In Progress' },
  { id: 'pending', label: 'Proposals Pending My Review' },
];

const sortOptions = [
  { key: 'internalDeadline', label: 'Internal Deadline' },
  { key: 'sponsorDeadline', label: 'Sponsor Deadline' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
];

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const pickValue = (item, keys, fallback = undefined) => {
  if (!item) return fallback;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(item, key) && item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return fallback;
};

const mapProposal = (item) => {
  const proposalId = pickValue(item, ['proposalId', 'proposalid', 'proposalID', 'id']);
  const internalDeadlineRaw = pickValue(item, [
    'internalDeadLineDate',
    'internaldeadlinedate',
    'internalDeadlineDate',
  ]);
  const sponsorDeadlineRaw = pickValue(item, [
    'sponsorDeadlineDate',
    'sponsordeadlinedate',
    'sponsorDeadLineDate',
  ]);
  const internalDeadline = formatDate(internalDeadlineRaw);
  const sponsorDeadline = formatDate(sponsorDeadlineRaw);
  const principalInvestigator =
    pickValue(item, ['principalInvestigatorName', 'principalInvestigator'], undefined) ||
    pickValue(item?.principalInvestigator, ['fullName', 'fullname'], undefined) ||
    pickValue(item?.investigator, ['fullName', 'fullname'], undefined) ||
    pickValue(item, ['createUserFullName', 'createuserfullname'], undefined);
  const homeUnit =
    pickValue(item, ['homeUnitName', 'homeunitname', 'homeUnitNumber', 'homeunitnumber'], '—') || '—';
  const applicationType =
    pickValue(item, ['applicationType', 'applicationtype', 'proposalType', 'proposaltype'], '—') || '—';
  const applicationStatus =
    pickValue(item, ['applicationStatus', 'applicationstatus', 'proposalStatus', 'proposalstatus'], '—') || '—';
  const sponsorName =
    pickValue(item, ['sponsorName', 'sponsorname', 'sponsor'], undefined) ||
    pickValue(item, ['sponsorCode', 'sponsorcode'], '—');

  return {
    id: proposalId ? proposalId.toString() : '—',
    title: stripHtmlTags(item.title)?.trim() || 'Untitled Proposal',
    principalInvestigator: stripHtmlTags(principalInvestigator) || '—',
    leadUnit: stripHtmlTags(homeUnit) || '—',
    type: stripHtmlTags(applicationType) || '—',
    status: stripHtmlTags(applicationStatus) || '—',
    sponsor: stripHtmlTags(sponsorName) || '—',
    internalDeadline,
    sponsorDeadline,
    internalDeadlineSort: Number(internalDeadlineRaw) || 0,
    sponsorDeadlineSort: Number(sponsorDeadlineRaw) || 0,
  };
};

const filterByTab = (proposals, tabId) => {
  switch (tabId) {
    case 'inProgress':
      return proposals.filter((p) =>
        p.status.toLowerCase().includes('progress') ||
        p.status.toLowerCase().includes('review'),
      );
    case 'pending':
      return proposals.filter((p) =>
        p.status.toLowerCase().includes('pending') ||
        p.status.toLowerCase().includes('approval'),
      );
    case 'all':
    case 'my':
    default:
      return proposals;
  }
};

const tabNameMap = {
  my: 'MY_PROPOSAL',
  all: 'ALL_PROPOSALS',
  inProgress: 'INPROGRESS_PROPOSAL',
  pending: 'MY_REVIEW_PENDING_PROPOSAL',
};

const AwardsScreen = () => {
  const theme = useTheme();
  const currentUniversityUid = useSelector((state) => state.tenant.currentUniversityUid);
  const [activeTab, setActiveTab] = useState(proposalTabs[0].id);
  const [sortConfig, setSortConfig] = useState({
    key: 'internalDeadline',
    direction: 'asc',
  });
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rawProposals, setRawProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiTab = tabNameMap[activeTab] || tabNameMap.my;
        const data = await fetchProposalsDashboard({
          tabName: apiTab,
          uid: currentUniversityUid || 'u100',
        });
        if (isMounted) {
          const proposalList = Array.isArray(data?.proposal)
            ? data.proposal
            : Array.isArray(data?.proposals?.proposal)
              ? data.proposals.proposal
              : Array.isArray(data)
                ? data
                : [];
          const mapped = proposalList.map(mapProposal);
          setRawProposals(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load proposals');
          setRawProposals([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProposals();
    return () => {
      isMounted = false;
    };
  }, [activeTab, currentUniversityUid]);

  const proposals = useMemo(() => {
    let results = filterByTab(rawProposals, activeTab);
    if (searchQuery.trim()) {
      const lookup = searchQuery.trim().toLowerCase();
      results = results.filter(
        (row) =>
          row.title.toLowerCase().includes(lookup) ||
          row.sponsor.toLowerCase().includes(lookup) ||
          row.id.toLowerCase().includes(lookup),
      );
    }
    const { key, direction } = sortConfig;
    const getComparable = (item) => {
      if (key === 'internalDeadline') {
        return item.internalDeadlineSort;
      }
      if (key === 'sponsorDeadline') {
        return item.sponsorDeadlineSort;
      }
      return (item[key] || '').toString().toLowerCase();
    };

    results = [...results].sort((a, b) => {
      const aVal = getComparable(a);
      const bVal = getComparable(b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return results;
  }, [activeTab, sortConfig, searchQuery, rawProposals]);

  const toggleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const getStatusTone = (status) => {
    const lowered = status?.toLowerCase() || '';
    if (lowered.includes('award') || lowered.includes('complete')) {
      return theme.colors.success || '#22c55e';
    }
    if (lowered.includes('review') || lowered.includes('progress')) {
      return theme.colors.warning || '#f59e0b';
    }
    return theme.colors.error || '#ef4444';
  };

  const heroTextColor = theme.colors.text || '#0f172a';
  const heroMutedColor = theme.colors.textSecondary || 'rgba(15,23,42,0.65)';
  const heroBorderColor = theme.colors.border || 'rgba(15,23,42,0.2)';

  const activeSortOption =
    sortOptions.find((option) => option.key === sortConfig.key) || sortOptions[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Proposals</Text>
      <Text style={[styles.subtitle, { color: '#000000' }]}>
        Track submissions, review stages, and sponsor deadlines in one place.
      </Text>

      <View style={[styles.tabRowContainer, { borderBottomColor: '#E5E7EB' }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {proposalTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isActive && { borderBottomColor: '#000000' },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: '#000000',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.sortControls}>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              borderColor: '#E5E7EB',
              backgroundColor: theme.colors.surface,
            },
          ]}
          onPress={() => setSortMenuVisible(true)}
          activeOpacity={0.85}
        >
          <View>
            <Text style={[styles.dropdownLabel, { color: '#000000' }]}>Sort by</Text>
            <Text style={[styles.dropdownValue, { color: '#000000' }]}>
              {activeSortOption.label}
            </Text>
          </View>
          <Icon name="chevron-down" size={16} color={'#000000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.clearButton, { borderColor: heroBorderColor }]}
          onPress={() => {
            setSortConfig({
              key: 'internalDeadline',
              direction: 'asc',
            });
            setSearchQuery('');
          }}
          activeOpacity={0.8}
        >
          <Icon name="close-circle-outline" size={16} color={'#000000'} />
          <Text style={[styles.clearText, { color: '#000000' }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.cardList}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <Text style={[styles.subtitle, { color: '#000000' }]}>
            Loading proposals...
          </Text>
        )}
        {error && (
          <Text style={[styles.subtitle, { color: '#000000' }]}>
            {error}
          </Text>
        )}
        {!loading && !error && proposals.length === 0 && (
          <Text style={[styles.subtitle, { color: '#000000' }]}>
            No proposals found.
          </Text>
        )}
        {proposals.map((proposal) => (
          <View
            key={proposal.id}
            style={[
              styles.proposalCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: '#E5E7EB',
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.proposalId, { color: '#000000' }]}
                >
                  Proposal #{proposal.id}
                </Text>
                <Text style={[styles.proposalTitle, { color: '#000000' }]}>
                  {proposal.title}
                </Text>
              </View>
              <View style={styles.badgeColumn}>
                <View
                  style={[
                    styles.typeBadge,
                    { borderColor: '#E5E7EB', backgroundColor: theme.colors.background },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: theme.colors.text }]}>
                    {proposal.type}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusTone(proposal.status)}26` },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: getStatusTone(proposal.status) },
                    ]}
                  >
                    {proposal.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metaGrid}>
            {proposal.sponsorDeadline !== '—' && (
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: '#000000' }]}>
                    Sponsor Deadline
                  </Text>
                  <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                    {proposal.sponsorDeadline}
                  </Text>
                </View>
            )}
            
              {proposal.internalDeadline !== '—' && (
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: '#000000' }]}>
                    Internal Deadline
                  </Text>
                  <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                    {proposal.internalDeadline}
                  </Text>
                </View>
              )}
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: '#000000' }]}>
                  Sponsor
                </Text>
                <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                  {proposal.sponsor}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              {/* <View style={styles.footerPill}>
                <Icon
                  name="person-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[styles.footerText, { color: theme.colors.textSecondary }]}
                >
                  {proposal.principalInvestigator}
                </Text>
              </View> */}
              {/* <View style={styles.footerPill}>
                <Icon
                  name="business-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[styles.footerText, { color: theme.colors.textSecondary }]}
                >
                  {proposal.leadUnit}
                </Text>
              </View> */}
              <TouchableOpacity
                style={[
                  styles.viewButton,
                  { borderColor: '#E5E7EB', backgroundColor: theme.colors.background },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedProposal(proposal);
                  setViewModalVisible(true);
                }}
              >
                <Icon name="eye-outline" size={14} color={'#000000'} />
                <Text style={[styles.viewButtonText, { color: '#000000' }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={sortMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdownList,
                  { backgroundColor: theme.colors.surface, borderColor: '#E5E7EB' },
                ]}
              >
                {sortOptions.map((option) => {
                  const isActive = option.key === sortConfig.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={styles.dropdownItem}
                      onPress={() => {
                        toggleSort(option.key);
                        setSortMenuVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemLabel,
                          {
                            color: '#000000',
                            fontWeight: isActive ? '700' : '500',
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isActive && (
                        <Icon
                          name={
                            sortConfig.direction === 'asc'
                              ? 'arrow-up-outline'
                              : 'arrow-down-outline'
                          }
                          size={16}
                          color={'#000000'}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setViewModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                {selectedProposal && (
                  <>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                      Proposal #{selectedProposal.id}
                    </Text>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Title
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.title}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Status
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.status}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Type
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.type}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Sponsor
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.sponsor}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Sponsor Deadline
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.sponsorDeadline}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Internal Deadline
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.internalDeadline}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        PI
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.principalInvestigator}
                      </Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>
                        Lead Unit
                      </Text>
                      <Text style={[styles.modalValue, { color: theme.colors.text }]}>
                        {selectedProposal.leadUnit}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.modalCloseButton,
                        { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                      ]}
                      onPress={() => setViewModalVisible(false)}
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
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  tabRowContainer: {
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 12,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  cardList: {
    paddingBottom: 32,
    gap: 12,
  },
  proposalCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
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
    justifyContent: 'flex-end',

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
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
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
});

export default AwardsScreen;
