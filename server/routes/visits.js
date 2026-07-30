const express = require('express');
const router = express.Router();
const { initCatalyst, getTable, getAllRows, insertRow, updateRow } = require('../utils/catalyst');
const { getDoctorQueue, getPatientQueuePosition, estimateWaitTime } = require('../utils/queueAlgorithm');

const TABLE_NAME = 'Visits';

/**
 * GET /visits
 * Fetch visits with optional filters
 * Query params: 
 *   - doctorId: filter by DoctorID
 *   - patientId: filter by PatientID
 *   - status: filter by Status (Waiting, In Consultation, Completed)
 */
router.get('/', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    let visits = await getAllRows(table);
    
    // Apply filters
    if (req.query.doctorId) {
      visits = visits.filter(v => v.DoctorID === req.query.doctorId);
    }
    
    if (req.query.patientId) {
      visits = visits.filter(v => v.PatientID === req.query.patientId);
    }
    
    if (req.query.status) {
      visits = visits.filter(v => v.Status === req.query.status);
    }
    
    res.json({ 
      success: true,
      data: visits,
      count: visits.length
    });
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch visits'
    });
  }
});

/**
 * GET /visits/queue/:doctorId
 * Get a doctor's queue sorted by the queue algorithm
 * Returns visits sorted by Priority (Urgent first) then CheckInTime (FIFO)
 */
router.get('/queue/:doctorId', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const allVisits = await getAllRows(table);
    const queueData = getDoctorQueue(allVisits, req.params.doctorId);
    
    res.json({ 
      success: true,
      data: queueData,
      message: 'Queue sorted by priority (Urgent first) then check-in time (FIFO)'
    });
  } catch (error) {
    console.error('Error fetching doctor queue:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch doctor queue'
    });
  }
});

/**
 * GET /visits/:id
 * Fetch a single visit by ROWID with queue position
 */
router.get('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const visits = await getAllRows(table);
    const visit = visits.find(v => v.ROWID === req.params.id);
    
    if (!visit) {
      return res.status(404).json({ 
        success: false,
        error: 'Visit not found'
      });
    }
    
    // Calculate queue position if visit is waiting
    let queuePosition = 0;
    let estimatedWait = 0;
    
    if (visit.Status === 'Waiting') {
      queuePosition = getPatientQueuePosition(visits, visit.ROWID, visit.DoctorID);
      estimatedWait = estimateWaitTime(queuePosition);
    }
    
    res.json({ 
      success: true,
      data: {
        ...visit,
        queuePosition,
        estimatedWaitMinutes: estimatedWait
      }
    });
  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch visit'
    });
  }
});

/**
 * POST /visits
 * Create a new visit (check-in)
 * Body: { PatientID, DoctorID, VisitDate, Reason, Priority? }
 * Automatically sets Status to "Waiting" and CheckInTime to now
 */
router.post('/', async (req, res) => {
  try {
    const { PatientID, DoctorID, VisitDate, Reason, Priority } = req.body;
    
    // Validation
    if (!PatientID || !DoctorID || !VisitDate || !Reason) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: PatientID, DoctorID, VisitDate, Reason are required'
      });
    }
    
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    const now = new Date().toISOString();
    
    const rowData = {
      PatientID: PatientID.trim(),
      DoctorID: DoctorID.trim(),
      VisitDate: VisitDate,
      Reason: Reason.trim(),
      Status: 'Waiting',
      Priority: Priority?.trim() || 'Normal',
      CheckInTime: now,
      ConsultStartTime: '',
      ConsultEndTime: '',
      Notes: ''
    };
    
    const result = await insertRow(table, rowData);
    
    res.status(201).json({ 
      success: true,
      data: result,
      message: 'Patient checked in successfully'
    });
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create visit'
    });
  }
});

/**
 * PATCH /visits/:id
 * Update a visit
 * Body: { Status?, Priority?, Notes?, Reason? }
 * 
 * Status transition logic:
 * - Waiting → In Consultation: stamps ConsultStartTime
 * - In Consultation → Completed: stamps ConsultEndTime
 */
router.patch('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const table = getTable(catalystApp, TABLE_NAME);
    
    // Fetch existing visit to validate
    const visits = await getAllRows(table);
    const existingVisit = visits.find(v => v.ROWID === req.params.id);
    
    if (!existingVisit) {
      return res.status(404).json({ 
        success: false,
        error: 'Visit not found'
      });
    }
    
    // Build update object
    const updateData = {};
    const now = new Date().toISOString();
    
    // Handle Status transitions with automatic timestamp stamping
    if (req.body.Status !== undefined) {
      const newStatus = req.body.Status.trim();
      const oldStatus = existingVisit.Status;
      
      updateData.Status = newStatus;
      
      // Waiting → In Consultation: stamp ConsultStartTime
      if (oldStatus === 'Waiting' && newStatus === 'In Consultation') {
        updateData.ConsultStartTime = now;
      }
      
      // In Consultation → Completed: stamp ConsultEndTime
      if (oldStatus === 'In Consultation' && newStatus === 'Completed') {
        updateData.ConsultEndTime = now;
      }
      
      // Direct Waiting → Completed (edge case): stamp both times
      if (oldStatus === 'Waiting' && newStatus === 'Completed') {
        updateData.ConsultStartTime = now;
        updateData.ConsultEndTime = now;
      }
    }
    
    // Other updatable fields
    if (req.body.Priority !== undefined) updateData.Priority = req.body.Priority.trim();
    if (req.body.Notes !== undefined) updateData.Notes = req.body.Notes.trim();
    if (req.body.Reason !== undefined) updateData.Reason = req.body.Reason.trim();
    
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
      message: 'Visit updated successfully'
    });
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update visit'
    });
  }
});

module.exports = router;
