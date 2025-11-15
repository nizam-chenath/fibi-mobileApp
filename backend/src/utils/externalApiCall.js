const https = require('https');
const http = require('http');

/**
 * Converts object keys to lowercase recursively
 * @param {*} obj - Object or array to convert
 * @returns {*} - Object/array with lowercase keys
 */
function convertKeysToLowercase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToLowercase(item));
  } else if (obj !== null && typeof obj === 'object') {
    const converted = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        converted[lowerKey] = typeof obj[key] === 'object' && obj[key] !== null
          ? convertKeysToLowercase(obj[key])
          : obj[key];
      }
    }
    return converted;
  }
  return obj;
}

/**
 * Normalizes base URL - adds protocol if missing, handles localhost, etc.
 * @param {string} baseUrl - Base URL (can be IP, domain, or full URL)
 * @param {string} defaultPort - Default port to use if not specified
 * @returns {string} - Normalized base URL
 */
function normalizeBaseUrl(baseUrl, defaultPort = '5000') {
  if (!baseUrl) {
    return `http://localhost:${defaultPort}`;
  }

  let normalized = baseUrl.trim();

  // Check if it's already a full URL with protocol
  const hasProtocol = normalized.startsWith('http://') || normalized.startsWith('https://');

  if (!hasProtocol) {
    // If no protocol, add http:// for localhost, https:// for others
    if (normalized.includes('localhost') || normalized.startsWith('127.0.0.1')) {
      normalized = `http://${normalized}`;
    } else {
      normalized = `https://${normalized}`;
    }
  }

  // Remove trailing slash if present
  normalized = normalized.replace(/\/$/, '');

  return normalized;
}

/**
 * Makes an external API call to university backend
 * @param {string} baseUrl - Base URL of the external API (e.g., 'http://localhost:5000' or university IP)
 * @param {string} endpoint - API endpoint path (e.g., '/api/users/findUser')
 * @param {string} method - HTTP method (default: 'POST')
 * @param {object} data - Request body data
 * @param {object} options - Additional options
 * @param {number} options.connectionTimeout - Connection timeout in ms (default: 10000)
 * @param {number} options.requestTimeout - Request timeout in ms (default: 30000)
 * @param {boolean} options.convertKeysToLowercase - Whether to convert response keys to lowercase (default: true)
 * @param {boolean} options.returnFirstArrayElement - If response is array, return first element (default: true)
 * @returns {Promise<*>} - API response data or null on error
 */
async function callExternalApi(baseUrl, endpoint, method = 'POST', data = {}, options = {}) {
  const {
    connectionTimeout = 10000,
    requestTimeout = 30000,
    convertKeysToLowercase: shouldConvertKeys = true,
    returnFirstArrayElement = true
  } = options;

  return new Promise((resolve) => {
    try {
      // Normalize base URL
      const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
      
      // Construct full API URL
      const fullApiUrl = `${normalizedBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      console.log(`Calling external API: ${fullApiUrl}`);

      // Parse URL
      const url = new URL(fullApiUrl);
      const isHttps = url.protocol === 'https:';
      const httpModule = isHttps ? https : http;

      // Prepare request data
      const postData = JSON.stringify(data);

      // Build path with search params if any
      let path = url.pathname;
      if (url.search) {
        path += url.search;
      }

      // Request options
      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      // Connection timeout
      const connectionTimeoutId = setTimeout(() => {
        console.error('Connection timeout - server may not be running or unreachable');
        resolve(null);
      }, connectionTimeout);

      // Make request
      const req = httpModule.request(requestOptions, (res) => {
        clearTimeout(connectionTimeoutId);
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const parsedData = JSON.parse(responseData);
              console.log('External API returned data. Fields:', Object.keys(parsedData));

              // Convert keys to lowercase if requested
              let finalData = shouldConvertKeys ? convertKeysToLowercase(parsedData) : parsedData;

              // Handle array responses
              if (Array.isArray(finalData)) {
                if (finalData.length === 0) {
                  resolve(null);
                } else if (returnFirstArrayElement) {
                  resolve(finalData[0]);
                } else {
                  resolve(finalData);
                }
              } else {
                resolve(finalData);
              }
            } else {
              console.log(`API call failed with status ${res.statusCode}: ${responseData.substring(0, 200)}`);
              resolve(null);
            }
          } catch (error) {
            console.error('Error parsing API response:', error);
            console.error('Response data:', responseData.substring(0, 200));
            resolve(null);
          }
        });
      });

      // Error handling
      req.on('error', (error) => {
        clearTimeout(connectionTimeoutId);
        if (error.code === 'ECONNREFUSED') {
          console.error(`Connection refused - is the external server running on ${normalizedBaseUrl}?`);
        } else if (error.code === 'ETIMEDOUT') {
          console.error(`Connection timeout - server at ${normalizedBaseUrl} is not responding`);
        } else {
          console.error('Error calling external API:', error);
        }
        resolve(null);
      });

      // Request timeout
      req.setTimeout(requestTimeout, () => {
        clearTimeout(connectionTimeoutId);
        console.error(`Request timeout after ${requestTimeout}ms`);
        req.destroy();
        resolve(null);
      });

      // Socket timeout
      req.on('socket', (socket) => {
        socket.setTimeout(connectionTimeout, () => {
          clearTimeout(connectionTimeoutId);
          console.error('Socket connection timeout');
          req.destroy();
          resolve(null);
        });
      });

      // Send request
      req.write(postData);
      req.end();
    } catch (error) {
      console.error('Error setting up API request:', error);
      resolve(null);
    }
  });
}

module.exports = {
  callExternalApi,
  convertKeysToLowercase,
  normalizeBaseUrl
};

