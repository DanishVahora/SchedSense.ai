const express = require('express');
const router = express.Router();
const {
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
} = require('../controller/providerController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (for browsing providers)
router.get('/', getAllProviders);
router.get('/:id', getProviderById);
router.get('/:id/services', getServices);
router.get('/:id/availability', getAvailability);

// Protected routes (for provider management)
router.use(authenticateToken);

router.put('/:id', updateProvider);
router.delete('/:id', deleteProvider);

// Service management
router.post('/:id/services', addService);

// Availability management
router.post('/:id/availability', setAvailability);

// Booking rules
router.post('/:id/booking-rules', setBookingRules);
router.get('/:id/booking-rules', getBookingRules);

module.exports = router;