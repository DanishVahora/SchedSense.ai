const ServiceProvider = require('../models/serviceProvider');
const { updateProviderSchema, serviceSchema, availabilitySchema, bookingRulesSchema } = require('../utils/validation');

const getAllProviders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const isApproved = req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined;
        const isActive = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;

        const filters = {};
        if (isApproved !== undefined) filters.isApproved = isApproved;
        if (isActive !== undefined) filters.isActive = isActive;

        const providers = await ServiceProvider.findAll(limit, offset, filters);

        res.json({
            message: 'Service providers retrieved successfully',
            providers,
            pagination: {
                page,
                limit,
                hasMore: providers.length === limit
            }
        });
    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProviderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid provider ID' });
        }

        const provider = await ServiceProvider.findById(id);
        if (!provider) {
            return res.status(404).json({ error: 'Service provider not found' });
        }

        res.json({
            message: 'Service provider retrieved successfully',
            provider
        });
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid provider ID' });
        }

        // Validate input
        const { error, value } = updateProviderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const updatedProvider = await ServiceProvider.update(id, value);
        if (!updatedProvider) {
            return res.status(404).json({ error: 'Service provider not found' });
        }

        res.json({
            message: 'Service provider updated successfully',
            provider: updatedProvider
        });
    } catch (error) {
        console.error('Update provider error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid provider ID' });
        }

        const deletedProvider = await ServiceProvider.delete(id);
        if (!deletedProvider) {
            return res.status(404).json({ error: 'Service provider not found' });
        }

        res.json({
            message: 'Service provider deleted successfully',
            deletedProviderId: deletedProvider.id
        });
    } catch (error) {
        console.error('Delete provider error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Service management
const addService = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = serviceSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const service = await ServiceProvider.addService(id, value);
        res.status(201).json({
            message: 'Service added successfully',
            service
        });
    } catch (error) {
        console.error('Add service error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getServices = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await ServiceProvider.getServices(id);
        
        res.json({
            message: 'Services retrieved successfully',
            services
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Availability management
const setAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = availabilitySchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const availability = await ServiceProvider.setAvailability(id, value);
        res.json({
            message: 'Availability set successfully',
            availability
        });
    } catch (error) {
        console.error('Set availability error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        const availability = await ServiceProvider.getAvailability(id, startDate, endDate);
        res.json({
            message: 'Availability retrieved successfully',
            availability
        });
    } catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Booking rules management
const setBookingRules = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = bookingRulesSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const rules = await ServiceProvider.setBookingRules(id, value);
        res.json({
            message: 'Booking rules set successfully',
            rules
        });
    } catch (error) {
        console.error('Set booking rules error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBookingRules = async (req, res) => {
    try {
        const { id } = req.params;
        const rules = await ServiceProvider.getBookingRules(id);
        
        res.json({
            message: 'Booking rules retrieved successfully',
            rules: rules || {}
        });
    } catch (error) {
        console.error('Get booking rules error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllProviders,
    getProviderById,
    updateProvider,
    deleteProvider,
    addService,
    getServices,
    setAvailability,
    getAvailability,
    setBookingRules,
    getBookingRules
};