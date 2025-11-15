const jwt = require('jsonwebtoken');
// const { secretKey } = require('../config'); // Load your secret key from config
const tokenBlacklist = new Set();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        
        req.user = user; // Set the user information in the request object
        next();
    });
}

module.exports = authenticateToken;
