const { getResearchSummaryTable } = require('../models/dashboardOverviewModel');

const RESEARCH_SUMMARY_TABLE = async (req, res) => {
  try {
    // Extract payload from request body with defaults
    const {
      escentFlag = 'Y',
      isAdmin = '',
      tabName = 'RESEARCH_SUMMARY_TABLE',
      unitNumber = '000001'
    } = req.body;

    // Extract cookies from request headers
    const requestCookies = req.cookies || {};
    
    // Convert cookies object to Cookie header string format
    const cookieHeader = Object.entries(requestCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    // Prepare payload
    const payload = {
      escentFlag,
      isAdmin,
      tabName,
      unitNumber
    };

    // Call external API with payload and cookies
    const result = await getResearchSummaryTable(payload, cookieHeader || null);

    if (!result || !result.data) {
      return res.status(404).json({ 
        message: 'No research summary data found' 
      });
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

    // Return research summary data and cookie details
    return res.status(200).json({
      message: 'Research summary table data retrieved successfully',
      data: result.data,
      cookies: cookieDetails
    });
  } catch (error) {
    console.error('Error in RESEARCH_SUMMARY_TABLE:', error);
    
    // Handle request abortion
    if (req.aborted) {
      console.log('Request was aborted by client');
      return;
    }

    // Check if response was already sent
    if (res.headersSent) {
      console.error('Response already sent, cannot send error response');
      return;
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

    if (error.message && error.message.includes('aborted')) {
      return res.status(400).json({ 
        message: 'Request was aborted. Please ensure you are using POST method with valid JSON body.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: 'Error fetching research summary table data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { RESEARCH_SUMMARY_TABLE };

