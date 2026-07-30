const catalyst = require('zcatalyst-sdk-node');

/**
 * Catalyst Authentication Middleware
 * 
 * IMPORTANT: This middleware will work once the app is deployed to Catalyst
 * and authentication is configured in the Catalyst Console.
 * 
 * Setup Required (in Catalyst Console):
 * 1. Go to Cloud Scale → Authentication → User Management
 * 2. Create three roles:
 *    - Patient (default role, allow signup)
 *    - Doctor (admin-invited only, no signup)
 *    - Admin (admin-invited only, no signup)
 * 3. Go to Cloud Scale → Authentication → Whitelisting
 *    - Add your Slate domain (frontend URL)
 *    - Enable CORS checkbox
 * 
 * How it works:
 * - Every request to AppSail includes authentication context
 * - Catalyst SDK can extract the current user via getCurrentUser()
 * - User object includes: user_id, email_id, role_details
 */

/**
 * Middleware to check if user is authenticated
 */
function requireAuth(req, res, next) {
  try {
    const catalystApp = catalyst.initialize(req);
    const user = catalystApp.userManagement().getCurrentUser();
    
    if (!user || !user.user_id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Attach user to request for use in routes
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication'
    });
  }
}

/**
 * Middleware to check if user has a specific role
 * @param {string[]} allowedRoles - Array of role names (e.g., ['Admin', 'Doctor'])
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      const catalystApp = catalyst.initialize(req);
      const user = catalystApp.userManagement().getCurrentUser();
      
      if (!user || !user.user_id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      // Check if user has any of the allowed roles
      const userRole = user.role_details?.role_name;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }
      
      req.currentUser = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(403).json({
        success: false,
        error: 'Permission denied'
      });
    }
  };
}

/**
 * Get current user info (for /auth/me endpoint)
 */
async function getCurrentUserInfo(req, res) {
  try {
    const catalystApp = catalyst.initialize(req);
    const user = catalystApp.userManagement().getCurrentUser();
    
    if (!user || !user.user_id) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    // Return sanitized user info
    res.json({
      success: true,
      data: {
        id: user.user_id,
        email: user.email_id,
        role: user.role_details?.role_name || 'Patient',
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    });
  }
}

module.exports = {
  requireAuth,
  requireRole,
  getCurrentUserInfo
};
