const express = require('express');
const router = express.Router();
const { initCatalyst, getTable, getAllRows, insertRow, updateRow } = require('../utils/catalyst');

const TABLE_NAME = 'Doctors';

/**
 * GET /doctors
 * Fetch all doctors
 * Query params: userId (optional) - filter by UserID
 */
router.get('/', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    let doctors = await getAllRows(table);
    
    // Filter by UserID if provided
    if (req.query.userId) {
      doctors = doctors.filter(d => d.UserID === req.query.userId);
    }
    
    res.json({ 
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch doctors'
    });
  }
});

/**
 * GET /doctors/:id
 * Fetch a single doctor by ROWID
 */
router.get('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const doctors = await getAllRows(table);
    const doctor = doctors.find(d => d.ROWID === req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        error: 'Doctor not found'
      });
    }
    
    res.json({ 
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch doctor'
    });
  }
});

/**
 * POST /doctors
 * Create a new doctor
 * Body: { Name, Specialization, Email, Phone, UserID }
 */
router.post('/', async (req, res) => {
  try {
    const { Name, Specialization, Email, Phone, UserID } = req.body;
    
    // Validation
    if (!Name || !Specialization || !Email || !Phone) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: Name, Specialization, Email, Phone are required'
      });
    }
    
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const rowData = {
      Name: Name.trim(),
      Specialization: Specialization.trim(),
      Email: Email.trim(),
      Phone: Phone.trim(),
      UserID: UserID?.trim() || ''
    };
    
    const result = await insertRow(table, rowData);
    
    res.status(201).json({ 
      success: true,
      data: result,
      message: 'Doctor created successfully'
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create doctor'
    });
  }
});

/**
 * PATCH /doctors/:id
 * Update a doctor
 * Body: { Name?, Specialization?, Email?, Phone? }
 */
router.patch('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    // Fetch existing doctor to validate
    const doctors = await getAllRows(table);
    const existingDoctor = doctors.find(d => d.ROWID === req.params.id);
    
    if (!existingDoctor) {
      return res.status(404).json({ 
        success: false,
        error: 'Doctor not found'
      });
    }
    
    // Build update object (only include provided fields)
    const updateData = {};
    if (req.body.Name !== undefined) updateData.Name = req.body.Name.trim();
    if (req.body.Specialization !== undefined) updateData.Specialization = req.body.Specialization.trim();
    if (req.body.Email !== undefined) updateData.Email = req.body.Email.trim();
    if (req.body.Phone !== undefined) updateData.Phone = req.body.Phone.trim();
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No valid fields provided for update'
      });
    }
    
    const result = await updateRow(table, req.params.id, updateData);
    
    res.json({ 
      success: true,
      data: result,
      message: 'Doctor updated successfully'
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update doctor'
    });
  }
});

module.exports = router;
