const { getProposalsByUserName } = require('../models/proposalModel');

const getProposals = async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(400).json({ message: 'user_name is required' });
  }

  try {
    const proposals = await getProposalsByUserName(user_name);

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ message: 'No proposals found for this user' });
    }

    console.log(`Found ${proposals.length} proposals for user: ${user_name}`);
    return res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals from MySQL:', error);
    
    // Provide more specific error messages
    if (error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please check your database configuration.',
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
      message: 'Error fetching proposals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getProposals };

