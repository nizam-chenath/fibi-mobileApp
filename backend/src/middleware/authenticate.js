function authenticateToken(req, res, next) {
    // Check if any authentication cookie exists
    // Check multiple possible cookie names
    const token = req.cookies?.accessToken || 
                  req.cookies?.token || 
                  req.cookies?.Cookie_Token ||
                  req.headers?.cookie; // Also check Cookie header directly
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No authentication cookie found' });
    }
    
    // Cookie exists, allow request to proceed
    next();
}

module.exports = authenticateToken;
