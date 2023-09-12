// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config'); // Adjust the path as needed

module.exports = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization');

    // Check if there is no token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Verify the token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Attach the user data to the request object
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    });
};
