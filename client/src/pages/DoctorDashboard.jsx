import { useState, useEffect } from 'react';
import { doctorsApi, patientsApi, visitsApi } from '../utils/api';
import '../styles/Dashboard.css';

function DoctorDashboard({ user }) {
  const [doctor, setDoctor] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueStats, setQueueStats] = useState({
    waiting: 0,
    inConsultation: 0,
    completed: 0,
    total: 0
  });
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadDoctorData();
    // Refresh queue every 30 seconds
    const interval = setInterval(loadDoctorData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      
      // Get doctor record linked to this user
      const doctorsResponse = await doctorsApi.getAll();
      const doctorRecord = doctorsResponse.data?.find(d => d.UserID === user.id);
      
      if (doctorRecord) {
        setDoctor(doctorRecord);
        
        // Load queue using the algorithm-sorted endpoint
        const queueResponse = await visitsApi.getDoctorQueue(doctorRecord.ROWID);
        const queueData = queueResponse.data;
        
        setQueue(queueData.queue || []);
        setQueueStats({
          waiting: queueData.waiting || 0,
          inConsultation: queueData.inConsultation || 0,
          completed: queueData.completed || 0,
          total: queueData.total || 0
        });
        
        // Load patient details for queue
        const patientIds = [...new Set(queueData.queue.map(v => v.PatientID))];
        const patientsResponse = await patientsApi.getAll();
        const patientsMap = {};
        patientsResponse.data?.forEach(p => {
          patientsMap[p.ROWID] = p;
        });
        setPatients(patientsMap);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading doctor data:', err);
      setError(err.message || 'Failed to load doctor data');
      setLoading(false);
    }
  };

  const handleStatusChange = async (visitId, newStatus) => {
    setError('');
    setSuccess('');

    try {
      const updateData = { Status: newStatus };
      
      // If completing consultation, include notes if available
      if (newStatus === 'Completed' && selectedVisit?.ROWID === visitId && notes) {
        updateData.Notes = notes;
      }
      
      await visitsApi.update(visitId, updateData);
      
      setSuccess(`Visit status updated to "${newStatus}"`);
      setSelectedVisit(null);
      setNotes('');
      
      // Reload queue
      setTimeout(() => {
        loadDoctorData();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error updating visit:', err);
      setError(err.message || 'Failed to update visit status');
    }
  };

  const handleSaveNotes = async (visitId) => {
    if (!notes.trim()) return;
    
    setError('');
    setSuccess('');

    try {
      await visitsApi.update(visitId, { Notes: notes });
      setSuccess('Notes saved successfully');
      setNotes('');
      setSelectedVisit(null);
      
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError(err.message || 'Failed to save notes');
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateWaitTime = (checkInTime) => {
    if (!checkInTime) return 'N/A';
    const now = new Date();
    const checkIn = new Date(checkInTime);
    const diffMinutes = Math.floor((now - checkIn) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Waiting': return 'status-waiting';
      case 'In Consultation': return 'status-in-consultation';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading queue...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="dashboard">
        <h1>Doctor Dashboard</h1>
        <div className="error-message">
          No doctor record found for your account. Please contact administration.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Dr. {doctor.Name} - {doctor.Specialization}</p>
        </div>
        <button 
          className="btn-secondary btn-small" 
          onClick={loadDoctorData}
          disabled={loading}
        >
          🔄 Refresh Queue
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Queue Statistics */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="stat-card">
          <div className="stat-value">{queueStats.waiting}</div>
          <div className="stat-label">Waiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{queueStats.inConsultation}</div>
          <div className="stat-label">In Consultation</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{queueStats.completed}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{queueStats.total}</div>
          <div className="stat-label">Total Visits</div>
        </div>
      </div>

      {/* Priority Queue - Algorithm Applied */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2>Patient Queue</h2>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            Sorted by Priority (Urgent first), then Check-in Time (FIFO)
          </span>
        </div>

        {queue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✓</div>
            <div className="empty-state-message">No patients in queue</div>
            <p className="text-muted">All caught up!</p>
          </div>
        ) : (
          <div className="queue-table-container">
            <table className="queue-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Patient</th>
                  <th>Reason</th>
                  <th>Priority</th>
                  <th>Wait Time</th>
                  <th>Status</th>
                  <th style={{ width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((visit, index) => {
                  const patient = patients[visit.PatientID];
                  const isExpanded = selectedVisit?.ROWID === visit.ROWID;
                  
                  return (
                    <React.Fragment key={visit.ROWID}>
                      <tr style={{ 
                        backgroundColor: visit.Priority === 'Urgent' ? '#fef3c7' : 'transparent'
                      }}>
                        <td>
                          <div className="queue-position">{index + 1}</div>
                        </td>
                        <td>
                          <div className="patient-info">
                            <div className="patient-name">
                              {patient?.Name || 'Loading...'}
                            </div>
                            <div className="patient-details">
                              {patient?.Age}y • {patient?.Gender} • {patient?.Phone}
                            </div>
                          </div>
                        </td>
                        <td>{visit.Reason}</td>
                        <td>
                          {visit.Priority === 'Urgent' && (
                            <span className="status-pill priority-urgent">URGENT</span>
                          )}
                          {visit.Priority === 'Normal' && (
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Normal</span>
                          )}
                        </td>
                        <td className="time-info">
                          {calculateWaitTime(visit.CheckInTime)}
                        </td>
                        <td>
                          <span className={`status-pill ${getStatusClass(visit.Status)}`}>
                            {visit.Status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {visit.Status === 'Waiting' && (
                              <button
                                className="btn-primary btn-small"
                                onClick={() => handleStatusChange(visit.ROWID, 'In Consultation')}
                              >
                                Start
                              </button>
                            )}
                            {visit.Status === 'In Consultation' && (
                              <>
                                <button
                                  className="btn-secondary btn-small"
                                  onClick={() => setSelectedVisit(isExpanded ? null : visit)}
                                >
                                  {isExpanded ? 'Hide' : 'Notes'}
                                </button>
                                <button
                                  className="btn-primary btn-small"
                                  onClick={() => handleStatusChange(visit.ROWID, 'Completed')}
                                >
                                  Complete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-lg)' }}>
                            <div>
                              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Consultation Notes</h4>
                              {visit.Notes && (
                                <div style={{ 
                                  marginBottom: 'var(--spacing-md)', 
                                  padding: 'var(--spacing-sm)',
                                  backgroundColor: 'var(--color-surface)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.875rem'
                                }}>
                                  <strong>Previous notes:</strong> {visit.Notes}
                                </div>
                              )}
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add consultation notes..."
                                rows="4"
                                style={{
                                  width: '100%',
                                  padding: 'var(--spacing-sm)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.875rem',
                                  fontFamily: 'inherit',
                                  resize: 'vertical'
                                }}
                              />
                              <div style={{ marginTop: 'var(--spacing-sm)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <button
                                  className="btn-primary btn-small"
                                  onClick={() => handleSaveNotes(visit.ROWID)}
                                  disabled={!notes.trim()}
                                >
                                  Save Notes
                                </button>
                                <button
                                  className="btn-secondary btn-small"
                                  onClick={() => {
                                    setSelectedVisit(null);
                                    setNotes('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="info-message" style={{ marginTop: 'var(--spacing-xl)' }}>
        <strong>Queue Algorithm:</strong> Patients are automatically sorted by Priority level (Urgent cases first), 
        then by Check-in Time (first-in-first-out) within each priority level. This ensures urgent cases 
        receive immediate attention while maintaining fairness for normal priority patients.
      </div>
    </div>
  );
}

export default DoctorDashboard;
