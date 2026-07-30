const express = require('express');
const router = express.Router();
const { getCurrentUserInfo } = require('../middleware/auth');

/**
 * Authentication Routes
 * 
 * IMPORTANT: Catalyst handles authentication via its built-in system.
 * Login/Signup forms use Catalyst's embedded authentication.
 * 
 * These endpoints are for checking auth status, not handling login.
 * 
 * Frontend Setup:
 * 1. Use Catalyst's embedded authentication forms (provided by Catalyst SDK)
 * 2. After successful login, Catalyst sets authentication cookies
 * 3. All subsequent API requests include these cookies automatically
 * 4. Frontend can call /auth/me to get current user info
 */

/**
 * GET /auth/me
 * Get current authenticated user information
 */
router.get('/me', getCurrentUserInfo);

/**
 * POST /auth/logout
 * Logout current user
 * 
 * Note: Catalyst handles logout via its SDK
 * Frontend should call Catalyst's logout method
 */
router.post('/logout', (req, res) => {
  // Catalyst handles logout via its client SDK
  // This endpoint is just for consistency
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
