// ===== FIXED backend/server.js =====
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); // Only apply to API routes

// CORS configuration - FIXED
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory - FIXED PATH
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes - FIXED IMPORT
const emailRoutes = require('./routes/emailRoutes');
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'AI Email Generator API is running!'
    });
});

// Test route for debugging
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working correctly!',
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler - IMPROVED
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.originalUrl);
    if (req.originalUrl.startsWith('/api')) {
        res.status(404).json({ 
            error: 'API route not found',
            requestedRoute: req.originalUrl,
            availableRoutes: ['/api/generate-email', '/api/send-email', '/api/test']
        });
    } else {
        // Serve index.html for client-side routing
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
});