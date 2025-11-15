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
function normalizeBaseUrl(baseUrl, defaultPort = null) {
  if (!baseUrl) {
    return null;
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
 * Makes an external API call
 * @param {string} baseUrl - Base URL of the external API (from env or provided)
 * @param {string} endpoint - API endpoint path (e.g., '/api/login/')
 * @param {string} method - HTTP method (default: 'POST')
 * @param {object} data - Request body data
 * @param {object} options - Additional options
 * @param {number} options.connectionTimeout - Connection timeout in ms (default: 10000)
 * @param {number} options.requestTimeout - Request timeout in ms (default: 30000)
 * @param {boolean} options.convertKeysToLowercase - Whether to convert response keys to lowercase (default: true)
 * @param {boolean} options.returnFirstArrayElement - If response is array, return first element (default: true)
 * @param {boolean} options.returnCookies - Whether to return cookies from response (default: false)
 * @param {string|array} options.cookies - Cookies to send with request (Cookie header string or array of cookie strings)
 * @returns {Promise<*>} - API response data or null on error
 */
async function callExternalApi(baseUrl, endpoint, method = 'POST', data = {}, options = {}) {
  const {
    connectionTimeout = 10000,
    requestTimeout = 30000,
    convertKeysToLowercase: shouldConvertKeys = true,
    returnFirstArrayElement = true,
    returnCookies = false,
    cookies = null
  } = options;

  // Log cookies received
  //console.log('callExternalApi - cookies received:', cookies ? (cookies.substring(0, 50) + '...') : 'null');

  return new Promise((resolve) => {
    try {
      // Normalize base URL
      const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
      
      if (!normalizedBaseUrl) {
        console.error('Base URL is required for external API call');
        resolve(null);
        return;
      }
      
      // Construct full API URL
      const fullApiUrl = `${normalizedBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      //console.log(`Calling external API: ${fullApiUrl}`);

      // Parse URL
      const url = new URL(fullApiUrl);
      const isHttps = url.protocol === 'https:';
      const httpModule = isHttps ? https : http;

      // Prepare request data
      const postData = JSON.stringify(data);
      const postDataBuffer = Buffer.from(postData, 'utf8');
      const contentLength = postDataBuffer.length;
      
      // console.log('External API request data:', postData);
      // console.log('External API request data length:', contentLength);

      // Build path with search params if any
      let path = url.pathname;
      if (url.search) {
        path += url.search;
      }

      // Prepare headers - ensure Content-Length matches actual buffer length
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': contentLength.toString()
        // Don't set Connection header - let Node.js handle it automatically
      };

      // Add cookies to headers if provided (BEFORE logging)
      console.log('Checking cookies parameter:', cookies ? 'exists' : 'null/undefined');
      console.log('Cookies type:', typeof cookies);
      console.log('Cookies value (first 100 chars):', cookies ? cookies.substring(0, 100) : 'N/A');
      
      if (cookies) {
        if (typeof cookies === 'string' && cookies.trim().length > 0) {
          headers['Cookie'] = cookies;
          console.log('✓ Cookie header added successfully');
        } else if (Array.isArray(cookies) && cookies.length > 0) {
          // If array of cookie strings, join them
          headers['Cookie'] = cookies.join('; ');
          console.log('✓ Cookie header added from array');
        } else {
          console.log('⚠ Cookies parameter exists but is empty or invalid');
        }
      } else {
        console.log('⚠ No cookies provided to external API call');
      }
      
      console.log('External API headers (final):', JSON.stringify(headers, null, 2));

      // Request options
      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: path,
        method: method,
        headers: headers,
        agent: false // Disable connection pooling to avoid issues
      };

      // Connection timeout
      const connectionTimeoutId = setTimeout(() => {
        console.error('Connection timeout - server may not be running or unreachable');
        resolve(null);
      }, connectionTimeout);

      let requestCompleted = false;
      let requestBodySent = false;

      // Make request
      const req = httpModule.request(requestOptions, (res) => {
        if (requestCompleted) return;
        requestCompleted = true;
        clearTimeout(connectionTimeoutId);
        let responseData = '';

        // Log response status
        // console.log('External API response status:', res.statusCode);
        // console.log('External API response headers:', JSON.stringify(res.headers, null, 2));
        // console.log('Request body was sent:', requestBodySent);

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const parsedData = JSON.parse(responseData);
              //console.log('External API returned data. Fields:', Object.keys(parsedData));

              // Convert keys to lowercase if requested
              let finalData = shouldConvertKeys ? convertKeysToLowercase(parsedData) : parsedData;

              // Extract cookies if requested
              const cookies = returnCookies ? (res.headers['set-cookie'] || []) : null;

              // Handle array responses
              if (Array.isArray(finalData)) {
                if (finalData.length === 0) {
                  resolve(returnCookies ? { data: null, cookies } : null);
                } else if (returnFirstArrayElement) {
                  resolve(returnCookies ? { data: finalData[0], cookies } : finalData[0]);
                } else {
                  resolve(returnCookies ? { data: finalData, cookies } : finalData);
                }
              } else {
                resolve(returnCookies ? { data: finalData, cookies } : finalData);
              }
            } else {
              console.error(`❌ API call failed with status ${res.statusCode}`);
              console.error(`Response data (first 500 chars): ${responseData.substring(0, 500)}`);
              console.error(`Full response data length: ${responseData.length}`);
              
              // Try to parse error response
              try {
                const errorData = JSON.parse(responseData);
                console.error('Parsed error response:', JSON.stringify(errorData, null, 2));
              } catch (parseErr) {
                console.error('Could not parse error response as JSON');
              }
              
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
        if (requestCompleted) return;
        requestCompleted = true;
        clearTimeout(connectionTimeoutId);
        if (error.code === 'ECONNREFUSED') {
          console.error(`Connection refused - is the external server running on ${normalizedBaseUrl}?`);
        } else if (error.code === 'ETIMEDOUT') {
          console.error(`Connection timeout - server at ${normalizedBaseUrl} is not responding`);
        } else if (error.code === 'ECONNRESET') {
          console.error('Connection reset by peer - server closed connection');
        } else {
          console.error('Error calling external API:', error.code, error.message);
        }
        resolve(null);
      });

      // Request timeout
      req.setTimeout(requestTimeout, () => {
        if (requestCompleted) return;
        requestCompleted = true;
        clearTimeout(connectionTimeoutId);
        console.error(`Request timeout after ${requestTimeout}ms`);
        req.destroy();
        resolve(null);
      });

      // Socket timeout
      req.on('socket', (socket) => {
        socket.setTimeout(connectionTimeout, () => {
          if (requestCompleted) return;
          requestCompleted = true;
          clearTimeout(connectionTimeoutId);
          console.error('Socket connection timeout');
          req.destroy();
          resolve(null);
        });
      });

      // Send request body - write first to ensure it's in the buffer
      console.log('Sending request body, length:', contentLength);
      console.log('Request body content:', postData.substring(0, 200));
      
      // Write the body first, then end
      try {
        // Write the body data
        const written = req.write(postData, 'utf8');
        requestBodySent = true;
        console.log('Request body written, buffer returned:', written);
        
        // End the request after writing
        req.end(() => {
          console.log('✓ Request ended successfully');
        });
      } catch (writeError) {
        console.error('Error writing/ending request:', writeError);
        if (!requestCompleted) {
          requestCompleted = true;
          clearTimeout(connectionTimeoutId);
          req.destroy();
          resolve(null);
        }
      }
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

