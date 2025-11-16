// api/emailHubApi.js
import apiClient from './apiClient.js';
import { universityManager } from '../services/universityManager.jsx';

const NOTIFICATIONS_ENDPOINT = '/api/email-hub/my-notifications';
const MESSAGE_TYPES_ENDPOINT = '/api/email-hub/my-message-types';

export async function fetchEmailNotifications(payload = {}) {
  // Expected payload:
  // {
  //   uid: string,
  //   person_id: string,
  //   currentPage?: number,
  //   pageNumber?: number,
  //   sortBy?: string, // e.g., 'SEND_DATE'
  //   message_type?: string | null
  // }
  const uniUid = payload.uid || (await universityManager.getUniversityUid()) || 'u100';
  const body = {
    uid: uniUid,
    person_id: payload.person_id ?? '',
    currentPage: payload.currentPage ?? 1,
    pageNumber: payload.pageNumber ?? 20,
    sortBy: payload.sortBy ?? 'SEND_DATE',
    message_type: payload.message_type ?? null,
  };
  return apiClient.post(NOTIFICATIONS_ENDPOINT, body, { auth: false });
}

export async function fetchEmailMessageTypes(payload = {}) {
  // Expected payload:
  // {
  //   uid: string,
  //   person_id: string
  // }
  const uniUid = payload.uid || (await universityManager.getUniversityUid()) || 'u100';
  const body = {
    uid: uniUid,
    person_id: payload.person_id ?? '',
  };
  return apiClient.post(MESSAGE_TYPES_ENDPOINT, body, { auth: false });
}

export default {
  fetchEmailNotifications,
  fetchEmailMessageTypes,
};


