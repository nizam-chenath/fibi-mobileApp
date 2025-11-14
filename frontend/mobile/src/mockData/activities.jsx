// mockData/activities.jsx
export const mockActivities = {
  'harvard-001': [
    {
      id: 'activity-001',
      type: 'grant',
      action: 'Grant Approved',
      title: 'AI in Healthcare Research',
      timestamp: '2024-10-28',
      icon: '✅',
      color: '#28A745',
    },
    {
      id: 'activity-002',
      type: 'compliance',
      action: 'IRB Review Submitted',
      title: 'Human Subjects Study A',
      timestamp: '2024-10-27',
      icon: '📝',
      color: '#FFC107',
    },
    {
      id: 'activity-003',
      type: 'grant',
      action: 'New Grant Call Available',
      title: 'Research Innovation Fund 2024',
      timestamp: '2024-10-26',
      icon: '🔔',
      color: '#17A2B8',
    },
    {
      id: 'activity-004',
      type: 'report',
      action: 'Monthly Report Generated',
      title: 'October 2024 Research Summary',
      timestamp: '2024-10-25',
      icon: '📊',
      color: '#007BFF',
    },
    {
      id: 'activity-005',
      type: 'compliance',
      action: 'COI Disclosure Reminder',
      title: 'Annual COI Certification Due',
      timestamp: '2024-10-20',
      icon: '⚠️',
      color: '#DC3545',
    },
  ],
  'stanford-001': [
    {
      id: 'activity-006',
      type: 'grant',
      action: 'Proposal Accepted',
      title: 'Sustainable Energy Solutions Phase 2',
      timestamp: '2024-10-28',
      icon: '✅',
      color: '#2ECC71',
    },
    {
      id: 'activity-007',
      type: 'publication',
      action: 'Publication Added',
      title: 'Novel Findings in Biomedical Engineering',
      timestamp: '2024-10-27',
      icon: '📚',
      color: '#3498DB',
    },
  ],
};

export const getActivitiesByTenant = (tenantId) => {
  return mockActivities[tenantId] || [];
};

