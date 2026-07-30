/**
 * Hospital Queue Ordering Algorithm
 * 
 * This is the core algorithm for prioritizing patient visits in the waiting queue.
 * 
 * Sorting Rules (applied in order):
 * 1. Priority Level: "Urgent" patients are seen before "Normal" patients
 * 2. Check-in Time: Within the same priority level, patients are seen in 
 *    First-In-First-Out (FIFO) order based on their CheckInTime
 * 
 * This ensures urgent cases get immediate attention while maintaining fairness
 * for patients of the same priority level.
 */

/**
 * Sort visits according to the queue algorithm
 * @param {Array} visits - Array of visit objects with Status, Priority, and CheckInTime
 * @returns {Array} - Sorted array with urgent cases first, then FIFO within each priority
 */
function sortQueueByPriority(visits) {
  // Filter only waiting visits
  const waitingVisits = visits.filter(visit => visit.Status === 'Waiting');
  
  // Sort using the queue algorithm
  const sortedVisits = waitingVisits.sort((a, b) => {
    // Priority weight: Urgent = 0, Normal = 1
    // Lower numbers come first, so Urgent (0) comes before Normal (1)
    const priorityWeight = {
      'Urgent': 0,
      'Normal': 1
    };
    
    const aPriority = priorityWeight[a.Priority] ?? 1; // default to Normal if unknown
    const bPriority = priorityWeight[b.Priority] ?? 1;
    
    // Step 1: Compare by priority
    if (aPriority !== bPriority) {
      return aPriority - bPriority; // Urgent (0) before Normal (1)
    }
    
    // Step 2: If same priority, compare by CheckInTime (FIFO)
    // Earlier check-in times should come first
    const aTime = new Date(a.CheckInTime).getTime();
    const bTime = new Date(b.CheckInTime).getTime();
    
    return aTime - bTime; // Earlier time (smaller number) comes first
  });
  
  return sortedVisits;
}

/**
 * Get a doctor's queue with visits sorted by the queue algorithm
 * @param {Array} allVisits - All visits from the database
 * @param {string} doctorId - The ROWID of the doctor
 * @returns {Object} - Object containing sorted waiting queue and other visit counts
 */
function getDoctorQueue(allVisits, doctorId) {
  // Filter visits for this doctor
  const doctorVisits = allVisits.filter(visit => visit.DoctorID === doctorId);
  
  // Separate visits by status
  const waitingVisits = doctorVisits.filter(v => v.Status === 'Waiting');
  const inConsultationVisits = doctorVisits.filter(v => v.Status === 'In Consultation');
  const completedVisits = doctorVisits.filter(v => v.Status === 'Completed');
  
  // Apply queue algorithm to waiting visits
  const sortedQueue = sortQueueByPriority(doctorVisits);
  
  return {
    queue: sortedQueue, // Sorted by priority, then FIFO
    waiting: waitingVisits.length,
    inConsultation: inConsultationVisits.length,
    completed: completedVisits.length,
    total: doctorVisits.length
  };
}

/**
 * Calculate a patient's position in the queue for a specific doctor
 * @param {Array} allVisits - All visits from the database
 * @param {string} visitId - The ROWID of the patient's visit
 * @param {string} doctorId - The ROWID of the doctor
 * @returns {number} - Position in queue (1-indexed), or 0 if not in waiting queue
 */
function getPatientQueuePosition(allVisits, visitId, doctorId) {
  const doctorQueue = getDoctorQueue(allVisits, doctorId);
  const position = doctorQueue.queue.findIndex(visit => visit.ROWID === visitId);
  
  // Return 1-indexed position (0 means not found in waiting queue)
  return position >= 0 ? position + 1 : 0;
}

/**
 * Calculate estimated wait time for a patient based on their queue position
 * @param {number} queuePosition - Patient's position in queue (1-indexed)
 * @param {number} avgConsultTime - Average consultation time in minutes (default: 15)
 * @returns {number} - Estimated wait time in minutes
 */
function estimateWaitTime(queuePosition, avgConsultTime = 15) {
  if (queuePosition <= 0) return 0;
  
  // Simple estimation: (position - 1) * average consultation time
  // Subtract 1 because position 1 is next (minimal wait)
  return (queuePosition - 1) * avgConsultTime;
}

module.exports = {
  sortQueueByPriority,
  getDoctorQueue,
  getPatientQueuePosition,
  estimateWaitTime
};
