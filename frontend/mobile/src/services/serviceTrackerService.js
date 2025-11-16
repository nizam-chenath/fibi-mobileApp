import apiClient from '../api/apiClient.js';
import { API_BASE_URL } from '../config/config.js';

const DEFAULT_SERVICE_TRACKER_PAYLOAD = {
  uid: 'u100',
  advancedSearch: 'L',
  currentPage: 1,
  pageNumber: 20,
  sortBy: 'updateTimeStamp',
  tabName: 'MY_REQUEST',
  moduleCodes: [],
  reverse: 'DESC',
  serviceRequestId: '',
  serviceRequestSubject: '',
  sort: {},
  srPriorities: [],
  srStatusCodes: [],
  srTypeCodes: [],
};

export const fetchServiceTrackerData = async (overrides = {}) => {
  const endpoint = `${API_BASE_URL}/api/service-requests/my-requests`;
  const payload = { ...DEFAULT_SERVICE_TRACKER_PAYLOAD, ...overrides };
  console.log('[ServiceTracker] POST', endpoint);
  console.log('[ServiceTracker] Payload:', payload);
  let data;
  try {
    data = await apiClient.post(endpoint, payload);
    console.log('[ServiceTracker] Response:', data);
  } catch (err) {
    console.error('[ServiceTracker] Error:', {
      endpoint,
      payload,
      message: err?.message,
    });
    throw err;
  }
  // Normalize to expected shape { dashboardList: [...] }
  let list = [];
  if (Array.isArray(data)) {
    list = data;
  } else if (data && Array.isArray(data.results)) {
    list = data.results;
  } else if (data && Array.isArray(data.dashboardList)) {
    list = data.dashboardList;
  } else if (data && Array.isArray(data.items)) {
    list = data.items;
  } else if (data && data.servicerequests && Array.isArray(data.servicerequests.servicerequestlist)) {
    // New shape (all lowercase keys)
    list = data.servicerequests.servicerequestlist;
  } else if (data && data.serviceRequests && Array.isArray(data.serviceRequests.serviceRequestList)) {
    // CamelCase variant
    list = data.serviceRequests.serviceRequestList;
  } else if (
    data &&
    data.serviceRequests &&
    data.serviceRequests.servicerequests &&
    Array.isArray(data.serviceRequests.servicerequests.servicerequestlist)
  ) {
    // Nested: serviceRequests.servicerequests.servicerequestlist
    list = data.serviceRequests.servicerequests.servicerequestlist;
  } else if (
    data &&
    data.serviceRequests &&
    Array.isArray(data.serviceRequests.servicerequestlist)
  ) {
    // Nested variant without inner camel: serviceRequests.servicerequestlist
    list = data.serviceRequests.servicerequestlist;
  }

  // Map backend fields to UI-expected keys so the screen displays values
  const normalized = (list || []).map((it) => ({
    serviceRequestId: it.serviceRequestId ?? it.servicerequestid ?? it.COL_SR_ID,
    subject: it.subject ?? it.COL_SR_SUBJECT,
    type: it.type ?? it.servicerequesttype ?? it.COL_SR_TYPE,
    category: it.category ?? it.servicerequestcategory ?? it.COL_SR_CATEGORY,
    priority: it.priority ?? it.srpriority ?? it.COL_SR_PRIORITY,
    status: it.status ?? it.servicerequeststatusdata ?? it.servicerequeststatus ?? it.COL_SR_STATUS,
    assignee: it.assignee ?? it.assigneepersonname ?? it.COL_SR_ASSI_PERSON,
    department: it.department ?? it.unitname ?? it.COL_SR_DEPARTMENT,
    createDate: Number(it.createDate ?? it.createtimestamp ?? it.updatetimestamp ?? it.COL_SR_CREATE_DATE) || 0,
    // Keep original fields as well to avoid losing data consumed elsewhere
    ...it,
  }));

  return { dashboardList: normalized };
};
