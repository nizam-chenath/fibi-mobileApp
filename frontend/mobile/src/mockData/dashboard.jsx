// mockData/dashboard.jsx

const defaultAwardedSponsors = [
  {
    id: '002348',
    label: 'British Coal Corporation (BCC)',
    value: 47.8,
    colorToken: 'primary',
    color: '#2754C1',
  },
  {
    id: '000101',
    label: 'Air Force - ASD (Air)',
    value: 7.8,
    colorToken: 'accent',
    color: '#EA5A2B',
  },
  {
    id: '000110',
    label: 'Air Force - Hanscom AFB (Hanscom)',
    value: 6.1,
    colorToken: 'warning',
    color: '#F4B33F',
  },
  {
    id: '300002',
    label: 'Ministry of Education',
    value: 5.4,
    colorToken: 'success',
    color: '#7AC29A',
  },
  {
    id: '300006',
    label: 'Latest Inc (L1)',
    value: 4.6,
    colorToken: 'info',
    color: '#A45CE6',
  },
  {
    id: '001000',
    label: 'Air Force (Air)',
    value: 3.9,
    colorToken: 'neutral',
    color: '#4FC3F7',
  },
  {
    id: '300005',
    label: 'Ministry of Defence',
    value: 3.2,
    colorToken: 'secondary',
    color: '#B28451',
  },
  {
    id: '000114',
    label: 'United States Air Force Academy (USAFA)',
    value: 3.0,
    colorToken: 'tertiary',
    color: '#3CB9D4',
  },
  {
    id: '299998',
    label: 'ASPIRE (ASPIRE)',
    value: 2.7,
    colorToken: 'accent',
    color: '#FF8A65',
  },
  {
    id: '300004',
    label: 'Ministry of Health',
    value: 2.5,
    colorToken: 'success',
    color: '#5C6BC0',
  },
  {
    id: '000123',
    label: 'Army Materiel - Miscellaneous (Army)',
    value: 2.3,
    colorToken: 'warning',
    color: '#9E9D24',
  },
];

const defaultNotifications = [
  {
    id: 'notif-001',
    title: 'Budget revision approved',
    message: 'Your updated budget for Award #A-2039 has been approved.',
    source: 'Office of Research Services',
    timestamp: '2025-11-14T09:10:00Z',
    timeAgo: '2m ago',
    isUnread: true,
  },
  {
    id: 'notif-002',
    title: 'Compliance reminder',
    message: 'IRB renewal for Study #19-447 is due next week.',
    source: 'Compliance Center',
    timestamp: '2025-11-14T07:40:00Z',
    timeAgo: '1h ago',
    isUnread: false,
  },
  {
    id: 'notif-003',
    title: 'Proposal feedback',
    message: 'Reviewer comments added to Proposal #S-1187.',
    source: 'Submissions',
    timestamp: '2025-11-13T18:15:00Z',
    timeAgo: '15h ago',
    isUnread: false,
  },
  {
    id: 'notif-004',
    title: 'New sponsor question',
    message: 'Sponsor requested clarification on milestone dates.',
    source: 'Grants Management',
    timestamp: '2025-11-13T15:05:00Z',
    timeAgo: '18h ago',
    isUnread: false,
  },
];

const createNotificationsPayload = (items = defaultNotifications) => {
  const normalizedItems = Array.isArray(items) ? items : [];
  const unreadCount = normalizedItems.filter((item) => item.isUnread).length;

  return {
    latestId: normalizedItems[0]?.id || null,
    unreadCount,
    items: normalizedItems,
  };
};

const createDefaultProposalInsights = () => ({
  incomeLabel: 'Income',
  incomeTotal: 3092648.27,
  incomeSeries: [
    { id: 'inc-1', value: 42, color: '#FDBA74' },
    { id: 'inc-2', value: 64, color: '#F97316' },
    { id: 'inc-3', value: 88, color: '#FACC15' },
    { id: 'inc-4', value: 120, color: '#34D399' },
    { id: 'inc-5', value: 72, color: '#60A5FA' },
    { id: 'inc-6', value: 96, color: '#C084FC' },
    { id: 'inc-7', value: 54, color: '#F472B6' },
    { id: 'inc-8', value: 38, color: '#A3A3A3' },
  ],
  donutLabel: 'Unpaid Invoices',
  donutTotal: 156703.01,
  donutSegments: [
    { id: 'seg-1', value: 32, color: '#F87171' },
    { id: 'seg-2', value: 24, color: '#FBBF24' },
    { id: 'seg-3', value: 18, color: '#34D399' },
    { id: 'seg-4', value: 14, color: '#60A5FA' },
    { id: 'seg-5', value: 12, color: '#A855F7' },
  ],
});

const defaultDashboard = {
  overview: {
    headline: 'Welcome back!',
    activeGrants: 6,
    pendingProposals: 2,
    complianceTasks: 3,
    totalFunding: '$2.1M',
  },
  stats: [
    {
      id: 'stat-1',
      label: 'My Active Awards',
      value: 6,
      icon: '📊',
      colorToken: 'primary',
      trend: '+1 vs last month',
    },
    {
      id: 'stat-2',
      label: 'Pending Actions',
      value: 2,
      icon: '📝',
      colorToken: 'warning',
      trend: 'Action required',
    },
    {
      id: 'stat-3',
      label: 'Compliance Tasks',
      value: 3,
      icon: '✅',
      colorToken: 'success',
      trend: 'On track',
    },
    {
      id: 'stat-4',
      label: 'Total Awarded',
      value: '$2.1M',
      icon: '💰',
      colorToken: 'accent',
      trend: '+$350K YTD',
    },
  ],
  awardedBySponsor: defaultAwardedSponsors,
  modules: [
    {
      id: 'myAwards',
      name: 'My Awards',
      description: 'Track progress on active awards',
      icon: '🏆',
      badgeCount: 1,
      accentColorToken: 'primary',
    },
    {
      id: 'submissions',
      name: 'Submissions',
      description: 'Drafts and recently submitted proposals',
      icon: '📬',
      badgeCount: 2,
      accentColorToken: 'accent',
    },
    {
      id: 'compliance',
      name: 'Compliance Tasks',
      description: 'Assignments and reviews to complete',
      icon: '⚖️',
      badgeCount: 1,
      accentColorToken: 'warning',
    },
    {
      id: 'training',
      name: 'Training & Certifications',
      description: 'Stay current on required trainings',
      icon: '🎓',
      badgeCount: 0,
      accentColorToken: 'success',
    },
  ],
  proposalInsights: createDefaultProposalInsights(),
};

export const mockDashboardData = {
  'harvard-001': {
    Admin: {
      overview: {
        headline: 'Harvard Research Admin Centre',
        activeGrants: 32,
        pendingProposals: 12,
        complianceTasks: 7,
        totalFunding: '$18.4M',
      },
      stats: [
        {
          id: 'stat-1',
          label: 'Active Grants',
          value: 32,
          icon: '📊',
          colorToken: 'primary',
          trend: '+4 vs last month',
        },
        {
          id: 'stat-2',
          label: 'Pending Proposals',
          value: 12,
          icon: '📝',
          colorToken: 'accent',
          trend: '+3 awaiting review',
        },
        {
          id: 'stat-3',
          label: 'Compliance Alerts',
          value: 7,
          icon: '⚠️',
          colorToken: 'warning',
          trend: '2 urgent',
        },
        {
          id: 'stat-4',
          label: 'Total Funding',
          value: '$18.4M',
          icon: '💰',
          colorToken: 'success',
          trend: '+$2.8M YTD',
        },
      ],
      awardedBySponsor: defaultAwardedSponsors,
      modules: [
        {
          id: 'grants',
          name: 'Grants Management',
          description: 'Configure cycles and monitor workloads',
          icon: '💼',
          badgeCount: 4,
          accentColorToken: 'primary',
        },
        {
          id: 'compliance',
          name: 'Compliance Oversight',
          description: 'Track IRB, IACUC, and COI submissions',
          icon: '🛡️',
          badgeCount: 3,
          accentColorToken: 'warning',
        },
        {
          id: 'reports',
          name: 'Executive Reports',
          description: 'Build summaries for leadership',
          icon: '📈',
          badgeCount: 1,
          accentColorToken: 'accent',
        },
        {
          id: 'analytics',
          name: 'Portfolio Analytics',
          description: 'Explore trends and benchmarking',
          icon: '📊',
          badgeCount: 0,
          accentColorToken: 'success',
        },
      ],
    },
    Researcher: {
      overview: {
        headline: 'Harvard Researcher Workspace',
        activeGrants: 8,
        pendingProposals: 3,
        complianceTasks: 2,
        totalFunding: '$3.4M',
      },
      stats: [
        {
          id: 'stat-1',
          label: 'My Active Awards',
          value: 8,
          icon: '🏅',
          colorToken: 'primary',
          trend: '+2 new this quarter',
        },
        {
          id: 'stat-2',
          label: 'Pending Actions',
          value: 3,
          icon: '📝',
          colorToken: 'warning',
          trend: 'Due soon',
        },
        {
          id: 'stat-3',
          label: 'Upcoming Reviews',
          value: 2,
          icon: '🗓️',
          colorToken: 'accent',
          trend: 'Next 14 days',
        },
        {
          id: 'stat-4',
          label: 'Total Awarded',
          value: '$3.4M',
          icon: '💰',
          colorToken: 'success',
          trend: '+$600K YTD',
        },
      ],
      awardedBySponsor: defaultAwardedSponsors,
      modules: [
        {
          id: 'myAwards',
          name: 'My Awards',
          description: 'Milestones and reporting deadlines',
          icon: '🏆',
          badgeCount: 2,
          accentColorToken: 'primary',
        },
        {
          id: 'submissions',
          name: 'Submissions',
          description: 'Drafts and progress for active proposals',
          icon: '📬',
          badgeCount: 1,
          accentColorToken: 'accent',
        },
        {
          id: 'compliance',
          name: 'Compliance Tasks',
          description: 'Assigned IRB / IACUC items',
          icon: '⚖️',
          badgeCount: 1,
          accentColorToken: 'warning',
        },
        {
          id: 'mentoring',
          name: 'Mentoring',
          description: 'Support mentees and shared projects',
          icon: '🤝',
          badgeCount: 0,
          accentColorToken: 'success',
        },
      ],
    },
  },
  'stanford-001': {
    Admin: {
      overview: {
        headline: 'Stanford Sponsored Programs',
        activeGrants: 48,
        pendingProposals: 17,
        complianceTasks: 9,
        totalFunding: '$31.2M',
      },
      stats: [
        {
          id: 'stat-1',
          label: 'Active Grants',
          value: 48,
          icon: '📊',
          colorToken: 'primary',
          trend: '+5 vs last month',
        },
        {
          id: 'stat-2',
          label: 'Pending Proposals',
          value: 17,
          icon: '📝',
          colorToken: 'accent',
          trend: '4 awaiting approvals',
        },
        {
          id: 'stat-3',
          label: 'Compliance Alerts',
          value: 9,
          icon: '⚠️',
          colorToken: 'warning',
          trend: '3 urgent',
        },
        {
          id: 'stat-4',
          label: 'Total Funding',
          value: '$31.2M',
          icon: '💰',
          colorToken: 'success',
          trend: '+$5.8M YTD',
        },
      ],
      awardedBySponsor: defaultAwardedSponsors,
      modules: [
        {
          id: 'grants',
          name: 'Grant Lifecycle',
          description: 'Intake, review, award setup',
          icon: '🔄',
          badgeCount: 6,
          accentColorToken: 'primary',
        },
        {
          id: 'compliance',
          name: 'Risk & Compliance',
          description: 'COI, IRB, export controls',
          icon: '🛡️',
          badgeCount: 4,
          accentColorToken: 'warning',
        },
        {
          id: 'reports',
          name: 'Executive Reporting',
          description: 'Dashboards for leadership teams',
          icon: '📈',
          badgeCount: 2,
          accentColorToken: 'accent',
        },
        {
          id: 'publications',
          name: 'Publications',
          description: 'Track publications tied to awards',
          icon: '📚',
          badgeCount: 1,
          accentColorToken: 'success',
        },
      ],
    },
    Researcher: {
      overview: {
        headline: 'Stanford Researcher Home',
        activeGrants: 10,
        pendingProposals: 4,
        complianceTasks: 3,
        totalFunding: '$4.6M',
      },
      stats: [
        {
          id: 'stat-1',
          label: 'My Active Awards',
          value: 10,
          icon: '🏅',
          colorToken: 'primary',
          trend: '+1 in review',
        },
        {
          id: 'stat-2',
          label: 'Pending Actions',
          value: 4,
          icon: '📝',
          colorToken: 'warning',
          trend: 'Due within 7 days',
        },
        {
          id: 'stat-3',
          label: 'Team Tasks',
          value: 3,
          icon: '👥',
          colorToken: 'accent',
          trend: 'Shared with your lab',
        },
        {
          id: 'stat-4',
          label: 'Total Awarded',
          value: '$4.6M',
          icon: '💰',
          colorToken: 'success',
          trend: '+$820K YTD',
        },
      ],
      awardedBySponsor: defaultAwardedSponsors,
      modules: [
        {
          id: 'myAwards',
          name: 'Award Portfolio',
          description: 'Statements, milestones, deliverables',
          icon: '📂',
          badgeCount: 3,
          accentColorToken: 'primary',
        },
        {
          id: 'submissions',
          name: 'Proposal Submissions',
          description: 'Draft, revise, and submit proposals',
          icon: '✍️',
          badgeCount: 2,
          accentColorToken: 'accent',
        },
        {
          id: 'compliance',
          name: 'Compliance Center',
          description: 'Complete required documentation',
          icon: '✅',
          badgeCount: 1,
          accentColorToken: 'warning',
        },
        {
          id: 'collaboration',
          name: 'Collaboration Hub',
          description: 'Coordinate with co-investigators',
          icon: '🤝',
          badgeCount: 0,
          accentColorToken: 'success',
        },
      ],
    },
  },
};

const attachProposalInsights = (data) => {
  if (!data) return null;
  return {
    ...data,
    proposalInsights: data.proposalInsights || createDefaultProposalInsights(),
  };
};

const attachNotifications = (data) => {
  if (!data) return null;
  const hasCustomNotifications = Array.isArray(data.notifications?.items) && data.notifications.items.length > 0;
  const fallbackPayload = createNotificationsPayload(
    hasCustomNotifications ? data.notifications.items : defaultNotifications,
  );

  return {
    ...data,
    notifications: {
      ...fallbackPayload,
      ...data.notifications,
      unreadCount: data.notifications?.unreadCount ?? fallbackPayload.unreadCount,
      latestId: data.notifications?.latestId ?? fallbackPayload.latestId,
      items: hasCustomNotifications ? data.notifications.items : fallbackPayload.items,
    },
  };
};

const enrichDashboardData = (data) => attachNotifications(attachProposalInsights(data));

export const getDashboardData = (tenantId, role = 'Researcher') => {
  const tenantDashboards = mockDashboardData[tenantId];

  if (tenantDashboards) {
    return enrichDashboardData(
      tenantDashboards[role] ||
        tenantDashboards.default ||
        tenantDashboards.Researcher ||
        Object.values(tenantDashboards)[0],
    );
  }

  return enrichDashboardData(defaultDashboard);
};

