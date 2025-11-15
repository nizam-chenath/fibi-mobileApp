const { getServiceRequests: getServiceRequestsFromModel } = require('../models/serviceRequestModel');

const getServiceRequests = async (req, res) => {
  // Set response timeout
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      console.error('Response timeout for service requests request');
      res.status(504).json({ message: 'Request timeout - external API took too long to respond' });
    }
  });

  // Check if request was aborted
  let requestAborted = false;
  req.on('aborted', () => {
    requestAborted = true;
    console.log('Request was aborted by client');
    if (!res.headersSent) {
      res.status(400).json({ message: 'Request was aborted by client' });
    }
  });

  // Check if connection was closed
  req.on('close', () => {
    if (!res.headersSent && !requestAborted) {
      console.log('Request connection closed before response');
    }
  });

  // Early return if request was aborted
  if (requestAborted) {
    return;
  }

  // Extract payload fields from request body
  const { 
    advancedSearch, 
    currentPage, 
    moduleCodes,
    pageNumber, 
    reverse,
    serviceRequestId,
    serviceRequestSubject,
    sort,
    sortBy, 
    srPriorities,
    srStatusCodes,
    srTypeCodes,
    tabName
  } = req.body;

  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Request body is required and must be a valid JSON object' 
      });
    }
    // Extract cookies from request
    const requestCookies = req.cookies || {};
    
    // Convert cookies object to Cookie header string format
    let cookieHeader = Object.entries(requestCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    // Also check Cookie header if cookies weren't parsed
    if (!cookieHeader && req.headers.cookie) {
      cookieHeader = req.headers.cookie;
    }

    // Prepare payload with defaults and values from request body
    const payload = {
      advancedSearch: advancedSearch !== undefined ? advancedSearch : "L",
      currentPage: currentPage !== undefined ? currentPage : 1,
      moduleCodes: moduleCodes !== undefined ? moduleCodes : [],
      pageNumber: pageNumber !== undefined ? pageNumber : 20,
      reverse: reverse !== undefined ? reverse : "DESC",
      serviceRequestId: serviceRequestId !== undefined ? serviceRequestId : "",
      serviceRequestSubject: serviceRequestSubject !== undefined ? serviceRequestSubject : "",
      sort: sort !== undefined ? sort : {},
      sortBy: sortBy !== undefined ? sortBy : "updateTimeStamp",
      srPriorities: srPriorities !== undefined ? srPriorities : [],
      srStatusCodes: srStatusCodes !== undefined ? srStatusCodes : [],
      srTypeCodes: srTypeCodes !== undefined ? srTypeCodes : [],
      tabName: tabName !== undefined ? tabName : "MY_REQUEST"
    };

    // Check if request was aborted before making external API call
    if (requestAborted || res.headersSent) {
      return;
    }

    // Call external API with cookies and payload
    const result = await getServiceRequestsFromModel(payload, cookieHeader || null);

    // Check again if request was aborted after external API call
    if (requestAborted || res.headersSent) {
      return;
    }

    if (!result || !result.data) {
      return res.status(404).json({ message: 'No service requests found' });
    }

    // Parse and prepare cookie details from external API response
    const cookieDetails = [];
    
    // Set cookies from external API response
    if (result.cookies && result.cookies.length > 0) {
      result.cookies.forEach(cookieString => {
        // Parse cookie string and set it
        const cookieParts = cookieString.split(';');
        const [nameValue] = cookieParts;
        const [name, value] = nameValue.split('=');
        
        // Extract cookie options
        const cookieOptions = {
          httpOnly: cookieString.includes('HttpOnly'),
          secure: cookieString.includes('Secure') || process.env.NODE_ENV === 'production',
          sameSite: cookieString.includes('SameSite=Strict') ? 'strict' : 
                   cookieString.includes('SameSite=Lax') ? 'lax' : 'lax'
        };

        // Extract maxAge if present
        const maxAgeMatch = cookieString.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) {
          cookieOptions.maxAge = parseInt(maxAgeMatch[1]) * 1000; // Convert to milliseconds
        }

        // Set cookie in response
        res.cookie(name.trim(), value.trim(), cookieOptions);

        // Store cookie details for response
        cookieDetails.push({
          name: name.trim(),
          value: value.trim(),
          httpOnly: cookieOptions.httpOnly,
          secure: cookieOptions.secure,
          sameSite: cookieOptions.sameSite,
          maxAge: cookieOptions.maxAge || null
        });
      });
    }

    // Return service requests data and cookie details
    return res.status(200).json({
      serviceRequests: result.data,
      cookies: cookieDetails
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);

    if (error.name === 'BadRequestError' || error.message && error.message.includes('aborted')) {
      return res.status(400).json({
        message: 'Request was aborted. Please check your request format and try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Provide more specific error messages
    if (error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        message: 'External API connection timeout. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'External API connection refused. Is the external server running?',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.message && error.message.includes('not configured')) {
      return res.status(500).json({ 
        message: 'External API configuration error. Please check environment variables.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: 'Error fetching service requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getServiceRequests };

