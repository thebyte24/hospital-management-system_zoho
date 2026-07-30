const express = require('express');
const router = express.Router();
const { initCatalyst, getTable, getAllRows } = require('../utils/catalyst');

/**
 * GET /analytics
 * Compute and return wait-time analytics
 * 
 * Returns:
 * - averageWaitTimeToday: average time from CheckInTime to ConsultStartTime for today's visits
 * - currentlyWaiting: number of patients with Status = "Waiting"
 * - longestCurrentWait: max wait time among currently waiting patients (in minutes)
 * - completedToday: number of visits completed today
 * - waitingToday: number of visits still waiting today
 */
router.get('/', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const visitsTable = getTable(catalystApp, 'Visits');
    
    const allVisits = await getAllRows(visitsTable);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    // Filter visits from today
    const todaysVisits = allVisits.filter(v => {
      const visitDate = new Date(v.VisitDate);
      return visitDate >= todayStart && visitDate < todayEnd;
    });
    
    // Currently waiting patients (across all days, not just today)
    const waitingVisits = allVisits.filter(v => v.Status === 'Waiting');
    const currentlyWaiting = waitingVisits.length;
    
    // Longest current wait (in minutes)
    let longestCurrentWait = 0;
    if (waitingVisits.length > 0) {
      const waitTimes = waitingVisits.map(v => {
        const checkInTime = new Date(v.CheckInTime);
        const waitMs = now - checkInTime;
        return Math.floor(waitMs / 60000); // convert to minutes
      });
      longestCurrentWait = Math.max(...waitTimes);
    }
    
    // Average wait time for today (only for visits that have started consultation)
    const todaysStartedVisits = todaysVisits.filter(v => v.ConsultStartTime && v.ConsultStartTime !== '');
    let averageWaitTimeToday = 0;
    
    if (todaysStartedVisits.length > 0) {
      const totalWaitTime = todaysStartedVisits.reduce((sum, v) => {
        const checkInTime = new Date(v.CheckInTime);
        const startTime = new Date(v.ConsultStartTime);
        const waitMs = startTime - checkInTime;
        return sum + Math.floor(waitMs / 60000); // minutes
      }, 0);
      averageWaitTimeToday = Math.round(totalWaitTime / todaysStartedVisits.length);
    }
    
    // Completed today vs waiting today
    const completedToday = todaysVisits.filter(v => v.Status === 'Completed').length;
    const waitingToday = todaysVisits.filter(v => v.Status === 'Waiting').length;
    const inConsultationToday = todaysVisits.filter(v => v.Status === 'In Consultation').length;
    
    res.json({
      success: true,
      data: {
        averageWaitTimeToday, // in minutes
        currentlyWaiting,
        longestCurrentWait, // in minutes
        completedToday,
        waitingToday,
        inConsultationToday,
        totalVisitsToday: todaysVisits.length
      },
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error computing analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to compute analytics'
    });
  }
});

module.exports = router;
