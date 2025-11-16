import { INBOX_BASE_URL } from '../config/config.js';
import apiClient from './apiClient.js';

const ACTION_INBOX_PATH = `${INBOX_BASE_URL}/showInbox`;

const DEFAULT_REQUEST_BODY = {
  inboxId: null,
  moduleCode: null,
  moduleItemKey: null,
  messageTypeCode: null,
  message: null,
  userMessage: null,
  openedFlag: null,
  subjectType: null,
  toPersonId: '10000000001',
  arrivalDate: null,
  updateTimeStamp: null,
  updateUser: null,
  subModuleCode: null,
  subModuleItemKey: null,
  moduleName: null,
  alertType: null,
  expirationDate: null,
  isViewAll: 'Y',
  toDate: null,
  fromDate: null,
};

export const fetchActionInbox = async ({ personId, signal } = {}) => {
  const payload = {
    ...DEFAULT_REQUEST_BODY,
    toPersonId: personId || DEFAULT_REQUEST_BODY.toPersonId,
  };

  const data = await apiClient.post(ACTION_INBOX_PATH, payload, { signal });
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected action inbox response');
  }
  return data;
};

export default fetchActionInbox;

