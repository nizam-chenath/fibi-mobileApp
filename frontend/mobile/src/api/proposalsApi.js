import { API_BASE_URL, PROPOSALS_BASE_URL } from '../config/config.js';
import apiClient from './apiClient.js';
import { universityManager } from '../services/universityManager.jsx';

const PROPOSALS_ENDPOINT = '/api/proposals';
const RESEARCH_SUMMARY_ENDPOINT = '/getResearchSummaryDatasByWidget';

const DEFAULT_PROPOSAL_PAYLOAD = {
  uid: null,
  advancedSearch: 'L',
  currentPage: 1,
  pageNumber: 20,
  sortBy: 'updateTimeStamp',
  tabName: 'MY_PROPOSAL',
};

export const fetchProposalsDashboard = async (overrides = {}) => {
  const payload = {
    ...DEFAULT_PROPOSAL_PAYLOAD,
    ...overrides,
  };

  if (!payload.uid) {
    payload.uid = (await universityManager.getUniversityUid()) || 'u100';
  }

  const data = await apiClient.post(`${API_BASE_URL}${PROPOSALS_ENDPOINT}`, payload);
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected proposals response format');
  }

  return data?.proposals?.proposals || data;
};

export const fetchResearchSummaryWidget = async ({
  unitNumber = '000001',
  tabName = 'INPROGRESS_PROPOSALS_BY_SPONSOR',
  descentFlag = 'Y',
  currentPage = 1,
  pageNumber = 10,
} = {}) => {
  const payload = {
    unitNumber,
    tabName,
    descentFlag,
    currentPage,
    pageNumber,
  };

  const data = await apiClient.post(
    `${PROPOSALS_BASE_URL}${RESEARCH_SUMMARY_ENDPOINT}`,
    payload,
  );
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected research summary response format');
  }

  return data;
};

export default {
  fetchProposalsDashboard,
  fetchResearchSummaryWidget,
};

