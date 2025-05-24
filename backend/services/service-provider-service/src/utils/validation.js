const Joi = require('joi');

const registerSchema = Joi.object({
    businessName: Joi.string().min(2).max(100).required(),
    contactName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(20).optional(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().default('US')
    }).optional(),
    timeZone: Joi.string().default('UTC'),
    workingHours: Joi.object({
        monday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        tuesday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        wednesday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        thursday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        friday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        saturday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() }),
        sunday: Joi.object({ start: Joi.string(), end: Joi.string(), isWorking: Joi.boolean() })
    }).optional(),
    businessLicense: Joi.string().optional(),
    paymentDetails: Joi.object().optional(),
    logoUrl: Joi.string().uri().optional(),
    description: Joi.string().max(1000).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateProviderSchema = Joi.object({
    business_name: Joi.string().min(2).max(100).optional(),
    contact_name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(20).optional(),
    address: Joi.object().optional(),
    time_zone: Joi.string().optional(),
    working_hours: Joi.object().optional(),
    logo_url: Joi.string().uri().optional(),
    description: Joi.string().max(1000).optional(),
    is_approved: Joi.boolean().optional(),
    is_active: Joi.boolean().optional()
});

const serviceSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    duration: Joi.number().integer().min(15).max(480).required(),
    price: Joi.number().positive().required()
});

const availabilitySchema = Joi.object({
    date: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    isBlocked: Joi.boolean().default(false),
    reason: Joi.string().max(255).optional()
});

const bookingRulesSchema = Joi.object({
    minimumNoticeHours: Joi.number().integer().min(0).max(168).default(24),
    bufferTimeMinutes: Joi.number().integer().min(0).max(120).default(15),
    maxAdvanceBookingDays: Joi.number().integer().min(1).max(365).default(90),
    allowSameDayBooking: Joi.boolean().default(true),
    cancellationPolicy: Joi.string().max(1000).optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProviderSchema,
    serviceSchema,
    availabilitySchema,
    bookingRulesSchema
};