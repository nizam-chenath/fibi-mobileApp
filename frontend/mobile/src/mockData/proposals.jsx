const proposalRows = [
  {
    id: '4158',
    title: 'Personalized Treatment Pathways through Genomic Data Mining',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'Resubmission',
    grantCallAbbrev: 'PTP-Genomic',
    type: 'Resubmission',
    status: 'Not Awarded',
    sponsor: '300068 – National Institutes of Health (NIH)',
    fundingScheme: 'Federal',
    internalDeadline: '2025-11-18',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: false,
  },
  {
    id: '4168',
    title: 'Test Proposal with No Evaluation Grant call',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'PTS',
    grantCallAbbrev: 'PTS',
    type: 'New',
    status: 'Awarded',
    sponsor: '300038 – Polus Test Sponsor (PTS)',
    fundingScheme: 'PTS',
    internalDeadline: '2025-11-20',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: false,
  },
  {
    id: '4172',
    title: 'Should Be Completed',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'PTS',
    grantCallAbbrev: 'PTS',
    type: 'New',
    status: 'Awarded',
    sponsor: '300038 – Polus Test Sponsor (PTS)',
    fundingScheme: 'PTS',
    internalDeadline: '2025-11-20',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: true,
  },
  {
    id: '4176',
    title: "Why it doesn't go to completed status",
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'PTS',
    grantCallAbbrev: 'PTS',
    type: 'New',
    status: 'Awarded',
    sponsor: '300038 – Polus Test Sponsor (PTS)',
    fundingScheme: 'PTS',
    internalDeadline: '2025-11-19',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: false,
  },
  {
    id: '4187',
    title: '1 stage evaluation',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'OS',
    grantCallAbbrev: 'OS',
    type: 'New',
    status: 'Review In Progress',
    sponsor: '300057 – Polus Sample Testing Agency (PS)',
    fundingScheme: 'OS',
    internalDeadline: '2025-11-20',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: true,
  },
  {
    id: '4185',
    title: 'External 1 Stage Evaluation',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'OS',
    grantCallAbbrev: 'OS',
    type: 'New',
    status: 'Completed',
    sponsor: '300057 – Polus Sample Testing Agency (PS)',
    fundingScheme: 'OS',
    internalDeadline: '2025-11-20',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: false,
  },
  {
    id: '4189',
    title: 'One more proposal with evaluation',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'OS',
    grantCallAbbrev: 'OS',
    type: 'New',
    status: 'Review In Progress',
    sponsor: '300057 – Polus Sample Testing Agency (PS)',
    fundingScheme: 'OS',
    internalDeadline: '2025-11-20',
    sponsorDeadline: '2025-11-30',
    isMine: true,
    needsReview: false,
  },
  {
    id: '4194',
    title: 'T123',
    principalInvestigator: 'Smith, Will',
    leadUnit: '000001 – UTSMC',
    grantCall: 'ABC',
    grantCallAbbrev: 'ABC',
    type: 'New',
    status: 'Admin Check Completed',
    sponsor: '300001 – ASPIRE (ASPIRE)',
    fundingScheme: 'ABC',
    internalDeadline: '2025-11-19',
    sponsorDeadline: '2025-11-27',
    isMine: true,
    needsReview: true,
  },
];

export const proposalTabs = [
  { id: 'my', label: 'My Proposals' },
  { id: 'all', label: 'All Proposals' },
  { id: 'inProgress', label: 'Review In Progress' },
  { id: 'pending', label: 'Proposals Pending My Review' },
];

export const getProposals = (tab = 'my') => {
  switch (tab) {
    case 'inProgress':
      return proposalRows.filter((row) => row.status === 'Review In Progress');
    case 'pending':
      return proposalRows.filter((row) => row.needsReview);
    case 'all':
      return proposalRows;
    case 'my':
    default:
      return proposalRows.filter((row) => row.isMine);
  }
};

export default proposalRows;

