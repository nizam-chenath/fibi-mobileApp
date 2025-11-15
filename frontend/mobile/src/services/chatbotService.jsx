// services/chatbotService.jsx
import { CHATBOT_API_URL, CHATBOT_COOKIE_TOKEN } from '../config/constants.jsx';

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
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `Cookie_Token=${CHATBOT_COOKIE_TOKEN}`,
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

