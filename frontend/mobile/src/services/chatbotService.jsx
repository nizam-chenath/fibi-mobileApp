// services/chatbotService.jsx
import { CHATBOT_API_URL } from '../config/constants.jsx';
import { CHATBOT_COOKIE_TOKEN } from '../config/config.js';
import { tokenManager } from './tokenManager.jsx';

class ChatbotService {
  async sendMessage({ prompt, sessionId, personId }) {
    const payload = {
      prompt,
      personId,
    };

    if (sessionId) {
      payload.sessionId = sessionId;
    }

    try {
      const storedCookie = await tokenManager.getToken();
      const cookieValue = storedCookie;

      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieValue ? { Cookie: `Cookie_Token=${cookieValue}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Chatbot request failed');
      }

      return response.json();
    } catch (error) {
      console.error('[Chatbot] sendMessage error:', error);
      throw error;
    }
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;

