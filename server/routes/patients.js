const express = require('express');
const router = express.Router();
const { initCatalyst, getTable, getAllRows, insertRow, updateRow } = require('../utils/catalyst');

const TABLE_NAME = 'Patients';

/**
 * GET /patients
 * Fetch all patients
 * Query params: userId (optional) - filter by UserID
 */
router.get('/', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    let patients = await getAllRows(table);
    
    // Filter by UserID if provided
    if (req.query.userId) {
      patients = patients.filter(p => p.UserID === req.query.userId);
    }
    
    res.json({ 
      success: true,
      data: patients,
      count: patients.length
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch patients'
    });
  }
});

/**
 * GET /patients/:id
 * Fetch a single patient by ROWID
 */
router.get('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const patients = await getAllRows(table);
    const patient = patients.find(p => p.ROWID === req.params.id);
    
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.json({ 
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch patient'
    });
  }
});

/**
 * POST /patients
 * Create a new patient
 * Body: { Name, Age, Gender, Phone, BloodGroup, UserID? }
 */
router.post('/', async (req, res) => {
  try {
    const { Name, Age, Gender, Phone, BloodGroup, UserID } = req.body;
    
    // Validation
    if (!Name || !Age || !Gender || !Phone) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: Name, Age, Gender, Phone are required'
      });
    }
    
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const rowData = {
      Name: Name.trim(),
      Age: parseInt(Age),
      Gender: Gender.trim(),
      Phone: Phone.trim(),
      BloodGroup: BloodGroup?.trim() || '',
      UserID: UserID?.trim() || ''
    };
    
    const result = await insertRow(table, rowData);
    
    res.status(201).json({ 
      success: true,
      data: result,
      message: 'Patient created successfully'
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create patient'
    });
  }
});

/**
 * PATCH /patients/:id
 * Update a patient
 * Body: { Name?, Age?, Gender?, Phone?, BloodGroup? }
 */
router.patch('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    // Fetch existing patient to validate
    const patients = await getAllRows(table);
    const existingPatient = patients.find(p => p.ROWID === req.params.id);
    
    if (!existingPatient) {
      return res.status(404).json({ 
        success: false,
        error: 'Patient not found'
      });
    }
    
    // Build update object (only include provided fields)
    const updateData = {};
    if (req.body.Name !== undefined) updateData.Name = req.body.Name.trim();
    if (req.body.Age !== undefined) updateData.Age = parseInt(req.body.Age);
    if (req.body.Gender !== undefined) updateData.Gender = req.body.Gender.trim();
    if (req.body.Phone !== undefined) updateData.Phone = req.body.Phone.trim();
    if (req.body.BloodGroup !== undefined) updateData.BloodGroup = req.body.BloodGroup.trim();
    
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
      message: 'Patient updated successfully'
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update patient'
    });
  }
});

module.exports = router;
