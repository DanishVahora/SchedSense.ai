const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/serviceProvider');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const provider = await ServiceProvider.findById(decoded.providerId);

        if (!provider) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (!provider.is_active) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        req.provider = provider;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticateToken
};