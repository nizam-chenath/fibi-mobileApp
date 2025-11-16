import apiClient from './apiClient.js';

// Absolute endpoint to save FCM token details
const SAVE_FCM_DETAILS_ENDPOINT = 'https://fibi-mobileapp.onrender.com/api/user-fcm/create-details';

/**
 * Save the user's FCM token details after login.
 * Expects:
 *  - uid: selected university id (string)
 *  - person_id: numeric or string person id
 *  - person_name: user's display name
 *  - fcm_token: Firebase Cloud Messaging token from the device
 */
export const saveUserFcmDetails = async ({ uid, person_id, person_name, fcm_token }) => {
  if (!uid || !person_id || !person_name || !fcm_token) {
    throw new Error('Missing required fields: uid, person_id, person_name, fcm_token');
  }

  const payload = {
    uid: String(uid),
    person_id: typeof person_id === 'number' ? person_id : String(person_id),
    person_name: String(person_name),
    fcm_token: String(fcm_token),
  };

  // This endpoint currently does not require auth; set auth: false.
  // apiClient supports absolute URLs, so we can pass the full path.
  const res = await apiClient.post(SAVE_FCM_DETAILS_ENDPOINT, payload, { auth: false });
  return res;
};

export default {
  saveUserFcmDetails,
};


