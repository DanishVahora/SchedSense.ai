const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema
};
