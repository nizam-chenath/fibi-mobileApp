// mockData/dashboard.jsx

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

export const getDashboardData = (tenantId, role = 'Researcher') => {
  const tenantDashboards = mockDashboardData[tenantId];

  if (tenantDashboards) {
    return (
      tenantDashboards[role] ||
      tenantDashboards.default ||
      tenantDashboards.Researcher ||
      Object.values(tenantDashboards)[0]
    );
  }

  return defaultDashboard;
};

