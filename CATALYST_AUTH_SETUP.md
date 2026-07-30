# Catalyst Authentication Setup Guide

This document explains how to integrate Catalyst's built-in authentication with this application.

## Overview

Catalyst provides **Embedded Authentication** with role-based access control. Authentication is configured in the Catalyst Console, not in code.

## Setup Steps

### 1. Create Roles in Catalyst Console

Navigate to: **Cloud Scale → Authentication → User Management → Roles**

Create three roles with these exact names:

#### Role: **Patient**
- **Default Role**: Yes (checked)
- **Allow Signup**: Yes (checked)
- **Description**: Patients who can self-register and check in

#### Role: **Doctor**
- **Default Role**: No
- **Allow Signup**: No
- **Description**: Doctors who manage their patient queues
- **Note**: Admin must invite doctors via email

#### Role: **Admin**
- **Default Role**: No
- **Allow Signup**: No
- **Description**: Reception/Admin staff who manage check-ins and analytics
- **Note**: Admin must invite admin users via email

### 2. Configure CORS Whitelisting

Navigate to: **Cloud Scale → Authentication → Whitelisting**

Add your Slate (frontend) domain:
- **Domain**: Your Slate URL (e.g., `https://yourapp.onslate.in`)
- **Enable CORS**: Yes (checked)

This allows cross-domain requests from the frontend to the backend.

### 3. Invite Doctor and Admin Users

Navigate to: **Cloud Scale → Authentication → User Management → Users**

1. Click **"Invite User"**
2. Enter email address
3. Select role (Doctor or Admin)
4. Send invitation
5. User receives email with signup link

### 4. Deploy and Enable Auth Middleware

After deploying to Catalyst:

#### Backend (server/index.js)

Uncomment the auth middleware:

```javascript
// Uncomment these lines:
const { requireAuth, requireRole } = require('./middleware/auth');

// Add middleware to routes:
app.use('/patients', requireAuth, patientsRouter);
app.use('/doctors', requireAuth, doctorsRouter);
app.use('/visits', requireAuth, visitsRouter);
app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
```

#### Frontend (client/src/App.jsx)

Update authentication check to use Catalyst:

```javascript
useEffect(() => {
  // Check authentication via Catalyst
  fetch(`${API_URL}/auth/me`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUser({
          id: data.data.id,
          name: `${data.data.firstName} ${data.data.lastName}`,
          email: data.data.email,
          role: data.data.role
        });
      }
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
}, []);
```

## Authentication Flow

### Patient Signup (Self-Registration)

1. User visits `/signup`
2. Frontend uses Catalyst embedded signup form
3. User is automatically assigned "Patient" role
4. A Patient record is created in Data Store linked to UserID
5. User can immediately check in

### Doctor/Admin Login

1. Admin invites user via Catalyst Console
2. User receives invitation email
3. User sets password and logs in
4. Frontend redirects based on role

### Login Flow

1. User visits `/login`
2. Frontend uses Catalyst embedded login form
3. Catalyst sets authentication cookies
4. Frontend calls `/auth/me` to get user info
5. Frontend redirects to appropriate dashboard based on role

## Catalyst SDK Usage

### Backend (Node.js)

```javascript
const catalyst = require('zcatalyst-sdk-node');

// Initialize Catalyst from request
const catalystApp = catalyst.initialize(req);

// Get current user
const user = catalystApp.userManagement().getCurrentUser();

// User object contains:
// - user_id: unique user ID
// - email_id: user's email
// - role_details: { role_name: 'Patient' | 'Doctor' | 'Admin' }
// - first_name, last_name
```

### Frontend (React)

```javascript
// Catalyst provides embedded authentication forms
// Use Catalyst's JavaScript SDK for login/signup

// After login, all fetch requests must include credentials:
fetch(url, {
  credentials: 'include', // Important!
  headers: { 'Content-Type': 'application/json' },
  // ... other options
})
```

## Role-Based Access Control

### Backend Route Protection

```javascript
// Require any authenticated user
app.use('/patients', requireAuth, patientsRouter);

// Require specific roles
app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
```

### Frontend Route Protection

```javascript
// Already implemented in PrivateRoute component
// Redirects to /login if not authenticated
```

## Data Store Linking

When a user signs up or is created:

1. **Patient self-signup**:
   - Catalyst creates user with "Patient" role
   - Backend creates Patient record with `UserID = user.user_id`

2. **Doctor/Admin invitation**:
   - Catalyst creates user with appropriate role
   - Admin creates Doctor record manually with `UserID = user.user_id`

## Testing Authentication

### Development (Local)

During local development, authentication is mocked in the frontend.
Backend routes are unprotected for testing.

### Production (Catalyst)

1. Deploy to Catalyst
2. Enable auth middleware (uncomment lines in server/index.js)
3. Test with real users:
   - Create a patient via signup
   - Invite a doctor via console
   - Invite an admin via console

## Common Issues

### Issue: "Authentication required" error

**Cause**: Frontend not sending cookies with requests

**Solution**: Ensure `credentials: 'include'` is set in all fetch requests

### Issue: CORS errors

**Cause**: Slate domain not whitelisted

**Solution**: Add Slate domain to Authentication → Whitelisting with CORS enabled

### Issue: User has wrong role

**Cause**: Role not configured correctly in console

**Solution**: Check Cloud Scale → Authentication → User Management → Roles

### Issue: Doctor/Admin cannot access /analytics

**Cause**: Role-based middleware not applied

**Solution**: Uncomment `requireRole` middleware in server/index.js

## Security Notes

1. **Never hardcode credentials** - Use Catalyst's authentication system
2. **Always use HTTPS** in production (Catalyst provides this automatically)
3. **Validate user role** on every protected backend endpoint
4. **CORS whitelist** only your actual frontend domain
5. **Session cookies** are HTTP-only and secure (handled by Catalyst)

## Reference

- [Catalyst Authentication Documentation](https://docs.catalyst.zoho.com/en/authentication/)
- [Catalyst User Management](https://docs.catalyst.zoho.com/en/user-management/)
- [Catalyst SDK - Node.js](https://docs.catalyst.zoho.com/en/sdk/nodejs/)
