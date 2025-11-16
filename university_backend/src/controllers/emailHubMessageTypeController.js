const { getAllMessageTypesForPerson } = require('../models/emailHubMessageTypeModel');

const getMessageTypes = async (req, res) => {
  try {
    // Get person_id from request body
    const personId = req.body.person_id;

    if (!personId) {
      return res.status(400).json({ 
        message: 'person_id is required' 
      });
    }

    // Fetch all message types for the person
    const messageTypes = await getAllMessageTypesForPerson(personId);

    if (!messageTypes || messageTypes.length === 0) {
      return res.status(200).json({ 
        message: 'No message types found for this person',
        messageTypes: []
      });
    }

    return res.status(200).json({
      message: 'Message types retrieved successfully',
      count: messageTypes.length,
      messageTypes: messageTypes
    });
  } catch (error) {
    console.error('Error fetching message types:', error);
    
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
      message: 'Error fetching message types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getMessageTypes };

