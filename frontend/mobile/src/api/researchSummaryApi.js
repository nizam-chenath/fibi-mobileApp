import { PROPOSALS_BASE_URL } from '../config/config.js';
import apiClient from './apiClient.js';

const RESEARCH_SUMMARY_ENDPOINT = `${PROPOSALS_BASE_URL}/getResearchSummaryDatasByWidget`;

export const fetchResearchSummaryTable = async ({
  unitNumber = '000001',
  tabName = 'RESEARCH_SUMMARY_TABLE',
  descentFlag = 'Y',
  isAdmin = '',
} = {}) => {
  const payload = {
    unitNumber,
    tabName,
    descentFlag,
    isAdmin,
  };

  const data = await apiClient.post(RESEARCH_SUMMARY_ENDPOINT, payload);
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected research summary response format');
  }

  return data;
};

export default {
  fetchResearchSummaryTable,
};


