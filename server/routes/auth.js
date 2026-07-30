const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getCurrentUserInfo } = require('../middleware/auth');
const { initCatalyst, getTable, getAllRows, insertRow } = require('../utils/catalyst');

/**
 * POST /auth/signup
 * Register a new user (Patient, Doctor, or Admin)
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, age, gender, phone, bloodGroup, specialization } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, password, and role are required'
      });
    }

    if (!['patient', 'doctor', 'admin'].includes(role.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid role. Must be patient, doctor, or admin'
      });
    }

    const catalystApp = initCatalyst(req);
    const usersTable = getTable(catalystApp, 'Users');
    
    // Check if user already exists
    const existingUsers = await getAllRows(usersTable);
    if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      email: email.trim(),
      password: hashedPassword,
      role: role.toLowerCase(),
      name: name.trim()
    };

    const userResult = await insertRow(usersTable, userData);
    const userId = userResult.ROWID;

    // Create role-specific record
    if (role.toLowerCase() === 'patient') {
      if (!age || !gender || !phone) {
        return res.status(400).json({ 
          success: false,
          error: 'Age, gender, and phone are required for patients'
        });
      }

      const patientsTable = getTable(catalystApp, 'Patients');
      await insertRow(patientsTable, {
        Name: name.trim(),
        Age: parseInt(age),
        Gender: gender.trim(),
        Phone: phone.trim(),
        BloodGroup: bloodGroup?.trim() || '',
        UserID: userId
      });
    } else if (role.toLowerCase() === 'doctor') {
      if (!specialization) {
        return res.status(400).json({ 
          success: false,
          error: 'Specialization is required for doctors'
        });
      }

      const doctorsTable = getTable(catalystApp, 'Doctors');
      await insertRow(doctorsTable, {
        Name: name.trim(),
        Specialization: specialization.trim(),
        Email: email.trim(),
        Phone: phone?.trim() || '',
        UserID: userId
      });
    }

    res.status(201).json({ 
      success: true,
      message: 'Signup successful',
      data: {
        userId,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Signup failed'
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required'
      });
    }

    const catalystApp = initCatalyst(req);
    const usersTable = getTable(catalystApp, 'Users');
    
    // Find user
    const users = await getAllRows(usersTable);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Return user data (without password)
    res.json({ 
      success: true,
      data: {
        userId: user.ROWID,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

/**
 * GET /auth/me
 * Get current authenticated user information
 */
router.get('/me', getCurrentUserInfo);

/**
 * POST /auth/logout
 * Logout current user
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
