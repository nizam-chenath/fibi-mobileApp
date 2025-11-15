function authenticateToken(req, res, next) {
    // Check if accessToken cookie exists
    const token = req.cookies?.accessToken || req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No authentication cookie found' });
    }
    
    // Cookie exists, allow request to proceed
    next();
}

module.exports = authenticateToken;
