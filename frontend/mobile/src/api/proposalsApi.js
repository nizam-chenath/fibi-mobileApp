import { API_BASE_URL, PROPOSALS_BASE_URL } from '../config/config.js';
import { tokenManager } from '../services/tokenManager.jsx';

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
    payload.uid = 'u100';
  }

  const cookieToken = await tokenManager.getToken();

  const headers = {
    'Content-Type': 'application/json',
  };

  if (cookieToken) {
    headers.Cookie = `Cookie_Token=${cookieToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${PROPOSALS_ENDPOINT}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to fetch proposals (${response.status})`);
  }

  const data = await response.json();
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

  const cookieToken = await tokenManager.getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (cookieToken) {
    headers.Cookie = `Cookie_Token=${cookieToken}`;
  }

  const response = await fetch(`${PROPOSALS_BASE_URL}${RESEARCH_SUMMARY_ENDPOINT}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to fetch research summary (${response.status})`);
  }

  const data = await response.json();
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected research summary response format');
  }

  return data;
};

export default {
  fetchProposalsDashboard,
  fetchResearchSummaryWidget,
};

