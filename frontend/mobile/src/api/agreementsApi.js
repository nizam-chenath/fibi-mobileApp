import { FIBI_DEMO_BASE_URL } from '../config/config.js';
import apiClient from './apiClient.js';

const AGREEMENT_STATUS_ENDPOINT = `${FIBI_DEMO_BASE_URL}/fibi-agreement/getAgreementStatusCountWidget`;

export const fetchAgreementStatusCountWidget = async ({
  unitNumber = '000001',
  tabName = 'AGREEMENT_COUNTS_BY_STATUS',
  descentFlag = 'Y',
} = {}) => {
  const payload = {
    unitNumber,
    tabName,
    descentFlag,
  };

  const data = await apiClient.post(AGREEMENT_STATUS_ENDPOINT, payload);

  if (!data || !Array.isArray(data)) {
    throw new Error('Unexpected agreement status response format');
  }

  return data;
};

export default {
  fetchAgreementStatusCountWidget,
};


