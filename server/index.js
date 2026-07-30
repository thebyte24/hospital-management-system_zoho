const express = require('express');
const cors = require('cors');
const catalyst = require('zcatalyst-sdk-node');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRouter = require('./routes/auth');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const visitsRouter = require('./routes/visits');
const analyticsRouter = require('./routes/analytics');

// Import auth middleware (use after deployment)
// const { requireAuth, requireRole } = require('./middleware/auth');

// Use routes
app.use('/auth', authRouter);

// TODO: After deploying to Catalyst and configuring authentication:
// 1. Uncomment the middleware imports above
// 2. Add requireAuth middleware to protect routes:
//    app.use('/patients', requireAuth, patientsRouter);
//    app.use('/doctors', requireAuth, doctorsRouter);
//    app.use('/visits', requireAuth, visitsRouter);
//    app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
//
// For now, routes are unprotected for development/testing:
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/visits', visitsRouter);
app.use('/analytics', analyticsRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Hospital Queue Management API',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// CRITICAL: Read port from Catalyst environment variable
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Hospital Queue API listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
