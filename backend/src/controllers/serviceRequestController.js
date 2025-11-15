const { findUserUniversity } = require('../models/userModel');
const { getServiceRequestsFromExternalApi } = require('../models/serviceRequestModel');

const getServiceRequests = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  try {
    // Find university based on uid
    const university = await findUserUniversity(uid);

    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    // Get base URL from university
    const baseUrl = university.ip || 'http://localhost:5000';
    //const baseUrl = 'http://localhost:5005';
    
    // Extract cookies from request headers
    const requestCookies = req.cookies || {};
    
    // Also check Cookie header if cookies weren't parsed
    let cookieHeader = null;
    if (Object.keys(requestCookies).length > 0) {
      // Convert cookies object to Cookie header string format
      cookieHeader = Object.entries(requestCookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    } else if (req.headers.cookie) {
      // Use Cookie header directly if available
      cookieHeader = req.headers.cookie;
    }

    // Extract specific fields from request body
    const { 
      uid: _, 
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
      tabName,
      ...otherProperties 
    } = req.body;

    // Prepare default payload with all required properties
    const defaultPayload = {
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

    // Merge with any additional properties from request body
    const payload = {
      ...defaultPayload,
      ...otherProperties
    };

    // Call external API with university IP, payload, and cookies
    const result = await getServiceRequestsFromExternalApi(baseUrl, payload, cookieHeader);

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
    
    return res.status(500).json({ 
      message: 'Error fetching service requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getServiceRequests };

