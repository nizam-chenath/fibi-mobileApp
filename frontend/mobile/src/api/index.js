import apiClient from './apiClient.js';
import * as authApi from './authApi.js';
import * as inboxApi from './inboxApi.js';
import * as proposalsApi from './proposalsApi.js';
import * as universityApi from './universityApi.js';
import * as agreementsApi from './agreementsApi.js';
import * as researchSummaryApi from './researchSummaryApi.js';
import * as logoutApi from './logoutApi.js';

export {
  apiClient,
  authApi,
  inboxApi,
  proposalsApi,
  universityApi,
  agreementsApi,
  researchSummaryApi,
  logoutApi,
};

const api = {
  client: apiClient,
  auth: authApi,
  inbox: inboxApi,
  proposals: proposalsApi,
  universities: universityApi,
  agreements: agreementsApi,
  researchSummary: researchSummaryApi,
  logout: logoutApi,
};

export default api;


