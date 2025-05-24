const express = require('express');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/user');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize database
const initializeDatabase = async () => {
    try {
        await User.createTable();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'User Service is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`User Service running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
