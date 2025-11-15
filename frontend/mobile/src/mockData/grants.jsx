// mockData/grants.jsx
export const mockGrants = {
  'harvard-001': [
    {
      id: 'grant-001',
      title: 'AI in Healthcare Research',
      principal: 'Dr. John Smith',
      amount: '$500,000',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2026-01-14',
      funder: 'National Science Foundation',
      department: 'Computer Science',
      progress: 65,
    },
    {
      id: 'grant-002',
      title: 'Climate Change Mitigation',
      principal: 'Dr. Jane Doe',
      amount: '$750,000',
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2025-05-31',
      funder: 'Department of Energy',
      department: 'Environmental Science',
      progress: 45,
    },
    {
      id: 'grant-003',
      title: 'Quantum Computing Applications',
      principal: 'Dr. Michael Chen',
      amount: '$1,200,000',
      status: 'Pending',
      startDate: '2024-09-01',
      endDate: '2027-08-31',
      funder: 'National Institutes of Health',
      department: 'Physics',
      progress: 0,
    },
  ],
  'stanford-001': [
    {
      id: 'grant-004',
      title: 'Sustainable Energy Solutions',
      principal: 'Prof. Robert Wilson',
      amount: '$1,500,000',
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2026-01-31',
      funder: 'Department of Energy',
      department: 'Engineering',
      progress: 55,
    },
    {
      id: 'grant-005',
      title: 'Biomedical Engineering',
      principal: 'Prof. Sarah Johnson',
      amount: '$890,000',
      status: 'Active',
      startDate: '2023-09-15',
      endDate: '2025-09-14',
      funder: 'National Institutes of Health',
      department: 'Biology',
      progress: 72,
    },
  ],
};

export const getGrantsByTenant = (tenantId) => {
  return mockGrants[tenantId] || [];
};

