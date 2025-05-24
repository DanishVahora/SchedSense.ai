const User = require('../models/user');
const { updateUserSchema } = require('../utils/validation');

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const users = await User.findAll(limit, offset);

        res.json({
            message: 'Users retrieved successfully',
            users,
            pagination: {
                page,
                limit,
                hasMore: users.length === limit
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Validate input
        const { error, value } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Convert camelCase to snake_case for database
        const updateData = {};
        if (value.firstName) updateData.first_name = value.firstName;
        if (value.lastName) updateData.last_name = value.lastName;
        if (value.username) updateData.username = value.username;
        if (value.email) updateData.email = value.email;
        if (value.isActive !== undefined) updateData.is_active = value.isActive;

        // Check for unique constraints
        if (value.email && value.email !== existingUser.email) {
            const emailExists = await User.findByEmail(value.email);
            if (emailExists) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }

        if (value.username && value.username !== existingUser.username) {
            const usernameExists = await User.findByUsername(value.username);
            if (usernameExists) {
                return res.status(409).json({ error: 'Username already taken' });
            }
        }

        const updatedUser = await User.update(id, updateData);

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const deletedUser = await User.delete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully',
            deletedUserId: deletedUser.id
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
