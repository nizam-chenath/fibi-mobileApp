const { getEmailHubEntries } = require('../models/emailHubModel');

const getEmailHub = async (req, res) => {
  try {
    // Get person_id from request body
    const personId = req.body.person_id;

    if (!personId) {
      return res.status(400).json({ 
        message: 'person_id is required' 
      });
    }

    // Extract pagination and filter options from request body
    const {
      currentPage,
      pageNumber,
      sortBy,
      message_type // Filter by notification type description
    } = req.body;

    // Prepare options for the model
    // message_type defaults to null - when null, fetches all message_type data
    const options = {
      currentPage: currentPage !== undefined ? currentPage : 1,
      pageNumber: pageNumber !== undefined ? pageNumber : 20,
      sortBy: sortBy !== undefined ? sortBy : 'SEND_DATE',
      message_type: message_type || null // null = fetch all message types
    };

    // Fetch email hub entries for the person with pagination and filtering
    const result = await getEmailHubEntries(personId, options);

    if (!result || !result.entries || result.entries.length === 0) {
      return res.status(200).json({ 
        message: 'No email hub entries found for this person',
        entries: [],
        pagination: result?.pagination || {
          currentPage: options.currentPage,
          pageNumber: options.pageNumber,
          total: 0,
          totalPages: 0
        }
      });
    }

    return res.status(200).json({
      message: 'Email hub entries retrieved successfully',
      entries: result.entries,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching email hub entries:', error);
    
    // Provide more specific error messages
    if (error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Database connection refused. Is MySQL server running?',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: 'Error fetching email hub entries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getEmailHub };

