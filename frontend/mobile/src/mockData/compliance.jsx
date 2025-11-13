// mockData/compliance.jsx
export const mockCompliance = {
  'harvard-001': [
    {
      id: 'compliance-001',
      type: 'IRB',
      title: 'Human Subjects Review - Study A',
      protocol: 'HSRB-2024-001',
      status: 'Pending',
      submittedDate: '2024-10-15',
      expiryDate: '2026-10-14',
      investigator: 'Dr. John Smith',
      subjects: 50,
    },
    {
      id: 'compliance-002',
      type: 'IACUC',
      title: 'Animal Care & Use - Study B',
      protocol: 'IACUC-2024-005',
      status: 'Approved',
      submittedDate: '2024-09-01',
      expiryDate: '2025-09-01',
      investigator: 'Dr. Jane Doe',
      animals: 100,
    },
    {
      id: 'compliance-003',
      type: 'COI',
      title: 'Conflict of Interest Disclosure',
      protocol: 'COI-2024-012',
      status: 'In Review',
      submittedDate: '2024-10-20',
      expiryDate: '2025-10-20',
      investigator: 'Dr. Michael Chen',
      interests: 3,
    },
  ],
  'stanford-001': [
    {
      id: 'compliance-004',
      type: 'IRB',
      title: 'Human Subjects Review - Behavioral Study',
      protocol: 'HSRB-2024-045',
      status: 'Approved',
      submittedDate: '2024-08-10',
      expiryDate: '2026-08-09',
      investigator: 'Prof. Robert Wilson',
      subjects: 200,
    },
  ],
};

export const getComplianceByTenant = (tenantId) => {
  return mockCompliance[tenantId] || [];
};

