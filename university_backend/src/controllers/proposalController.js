const { getProposals: getProposalsFromModel } = require('../models/proposalModel');

const getProposals = async (req, res) => {
  // Set response timeout
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      console.error('Response timeout for proposals request');
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

  try {
    // Log the raw request body for debugging
    // console.log('Raw request body:', JSON.stringify(req.body));
    // console.log('Request body keys:', Object.keys(req.body || {}));

    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Request body is required and must be a valid JSON object' 
      });
    }

    // Use the entire request body as payload, or extract specific fields
    // This allows flexibility - send whatever is in the body to the external API
    const payload = { ...req.body };

    // Extract cookies from request
    const requestCookies = req.cookies || {};
    
    // Convert cookies object to Cookie header string format
    const cookieHeader = Object.entries(requestCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

//    //console.log('Payload being sent:', JSON.stringify(payload));

    // Check if request was aborted before making external API call
    if (requestAborted || res.headersSent) {
      return;
    }

    // Call external API with cookies and payload
    //console.log('Calling model with cookieHeader:', cookieHeader ? (cookieHeader.substring(0, 50) + '...') : 'null');
    const result = await getProposalsFromModel(payload, cookieHeader || null);

    // Check again if request was aborted after external API call
    if (requestAborted || res.headersSent) {
      return;
    }

    if (!result || !result.data) {
      return res.status(404).json({ message: 'No proposals found for this user' });
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

    //console.log(`Found proposals for payload:`, payload);
    
    // Return proposals data and cookie details
    return res.status(200).json({
      proposals: result.data,
      cookies: cookieDetails
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    
    // Handle request aborted errors
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
      message: 'Error fetching proposals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getProposals };

