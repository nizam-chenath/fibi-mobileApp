const { findUserUniversity } = require('../models/userModel');
const { getEmailHubFromExternalApi, getMessageTypesFromExternalApi } = require('../models/emailHubModel');

const getEmailHub = async (req, res) => {
  const { uid, person_id } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  if (!person_id) {
    return res.status(400).json({ message: 'person_id is required' });
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

    // Extract pagination and filter options from request body
    const {
      uid: _,
      person_id: __,
      currentPage,
      pageNumber,
      sortBy,
      message_type
    } = req.body;

    // Prepare payload with person_id and pagination/filter options
    const payload = {
      person_id: person_id,
      currentPage: currentPage !== undefined ? currentPage : 1,
      pageNumber: pageNumber !== undefined ? pageNumber : 20,
      sortBy: sortBy !== undefined ? sortBy : 'SEND_DATE',
      message_type: message_type || null
    };

    // Call external API with university IP, payload, and cookies
    const result = await getEmailHubFromExternalApi(baseUrl, payload, cookieHeader);

    if (!result || !result.data) {
      return res.status(404).json({ message: 'No email hub entries found' });
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

    // Return email hub data with pagination and cookie details
    // result.data should contain entries and pagination from university_backend
    return res.status(200).json({
      entries: result.data.entries || result.data,
      pagination: result.data.pagination || null,
      cookies: cookieDetails
    });
  } catch (error) {
    console.error('Error fetching email hub:', error);
    
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
      message: 'Error fetching email hub',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getMessageTypes = async (req, res) => {
  const { uid, person_id } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  if (!person_id) {
    return res.status(400).json({ message: 'person_id is required' });
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

    // Prepare payload with person_id
    const payload = {
      person_id: person_id
    };

    // Call external API with university IP, payload, and cookies
    const result = await getMessageTypesFromExternalApi(baseUrl, payload, cookieHeader);

    if (!result || !result.data) {
      return res.status(404).json({ message: 'No message types found' });
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

    // Return message types data and cookie details
    return res.status(200).json({
      messageTypes: result.data.messageTypes || result.data,
      cookies: cookieDetails
    });
  } catch (error) {
    console.error('Error fetching message types:', error);
    
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
      message: 'Error fetching message types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getEmailHub, getMessageTypes };

