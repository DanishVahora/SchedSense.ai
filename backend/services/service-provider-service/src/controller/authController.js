const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/serviceProvider');
const { registerSchema, loginSchema } = require('../utils/validation');

const generateToken = (providerId) => {
    return jwt.sign({ providerId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const register = async (req, res) => {
    try {
        // Validate input
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const {
            businessName, contactName, email, password, phone, address,
            timeZone, workingHours, businessLicense, paymentDetails,
            logoUrl, description
        } = value;

        // Check if provider already exists
        const existingProvider = await ServiceProvider.findByEmail(email);
        if (existingProvider) {
            return res.status(409).json({ error: 'Service provider with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create service provider
        const newProvider = await ServiceProvider.create({
            businessName,
            contactName,
            email,
            password: hashedPassword,
            phone,
            address,
            timeZone,
            workingHours,
            businessLicense,
            paymentDetails,
            logoUrl,
            description
        });

        // Generate token
        const token = generateToken(newProvider.id);

        res.status(201).json({
            message: 'Service provider registered successfully',
            provider: newProvider,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        // Validate input
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;

        // Find provider
        const provider = await ServiceProvider.findByEmail(email);
        if (!provider) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, provider.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if provider is active
        if (!provider.is_active) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        // Check if provider is approved
        if (!provider.is_approved) {
            return res.status(401).json({ error: 'Account is pending approval' });
        }

        // Generate token
        const token = generateToken(provider.id);

        // Remove password from response
        const { password: _, ...providerResponse } = provider;

        res.json({
            message: 'Login successful',
            provider: providerResponse,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        res.json({
            message: 'Profile retrieved successfully',
            provider: req.provider
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};