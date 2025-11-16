import { API_BASE_URL } from '../config/config.js';
import { tokenManager } from '../services/tokenManager.jsx';
import { universityManager } from '../services/universityManager.jsx';

const isAbsoluteUrl = (path) => /^https?:\/\//i.test(path);
const isFormData = (body) =>
  typeof FormData !== 'undefined' && body instanceof FormData;

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  resolveUrl(path) {
    if (!path) {
      return this.baseUrl;
    }
    if (isAbsoluteUrl(path)) {
      return path;
    }
    const trimmedBase = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${trimmedBase}${normalizedPath}`;
  }

  async request(path, options = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      auth = true,
      responseType = 'json',
      returnResponse = false,
      timeoutMs = 15000,
      retries = 2,
      retryDelayMs = 1000,
      ...rest
    } = options;

    const url = this.resolveUrl(path);
    const finalHeaders = {
      Accept: 'application/json',
      ...headers,
    };

    if (auth) {
      const token = await tokenManager.getToken();
      if (token) {
        finalHeaders.Cookie = `Cookie_Token=${token}`;
      }
    }

    // attach selected university UID if available
    try {
      const universityUid = await universityManager.getUniversityUid();
      if (universityUid && !finalHeaders['X-University-Uid']) {
        finalHeaders['X-University-Uid'] = universityUid;
      }
    } catch {}

    let finalBody = body;
    const shouldSerializeBody =
      body &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      !isFormData(body) &&
      !headers['Content-Type'] &&
      method !== 'GET';

    if (shouldSerializeBody) {
      finalHeaders['Content-Type'] = 'application/json';
      finalBody = JSON.stringify(body);
    }

    Object.keys(finalHeaders).forEach((key) => {
      if (finalHeaders[key] == null) {
        delete finalHeaders[key];
      }
    });

    let attempt = 0;
    let lastError = null;
    while (attempt <= retries) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: finalHeaders,
          body: finalBody,
          credentials: 'include',
          signal: controller.signal,
          ...rest,
        });
        clearTimeout(id);
        if (!response.ok) {
          let errorMessage = '';
          try {
            errorMessage = await response.text();
          } catch {
            errorMessage = '';
          }
          // Retry on 5xx errors only
          if (response.status >= 500 && attempt < retries) {
            attempt += 1;
            const delay = retryDelayMs * Math.pow(2, attempt - 1);
            await new Promise((res) => setTimeout(res, delay));
            continue;
          }
          throw new Error(errorMessage || `Request failed (${response.status})`);
        }

        let data = null;
        if (responseType === 'json') {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } else if (responseType === 'text') {
          data = await response.text();
        } else if (responseType === 'blob') {
          data = await response.blob();
        } else if (responseType === 'arrayBuffer') {
          data = await response.arrayBuffer();
        }

        if (returnResponse) {
          return { data, response };
        }
        return data;
      } catch (err) {
        clearTimeout(id);
        lastError = err;
        // Retry on abort/network errors
        const isAbort = err?.name === 'AbortError';
        const isNetwork = /Network request failed|Failed to fetch|timeout|ECONNRESET|ENETUNREACH|wsarecv/i.test(
          String(err?.message || ''),
        );
        if ((isAbort || isNetwork) && attempt < retries) {
          attempt += 1;
          const delay = retryDelayMs * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }
        throw err;
      }
    }
    // If we reached here, all retries failed
    throw lastError || new Error('Request failed');
  }

  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path, body, options) {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;


