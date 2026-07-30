import { useState, useEffect } from 'react';
import { patientsApi, doctorsApi, visitsApi, analyticsApi } from '../utils/api';
import '../styles/Dashboard.css';

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, checkin, queues
  const [doctors, setDoctors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [allVisits, setAllVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check-in form state
  const [checkInForm, setCheckInForm] = useState({
    // Patient info
    isNewPatient: true,
    existingPatientId: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    bloodGroup: '',
    // Visit info
    doctorId: '',
    visitDate: new Date().toISOString().split('T')[0],
    reason: '',
    priority: 'Normal'
  });

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load doctors
      const doctorsResponse = await doctorsApi.getAll();
      setDoctors(doctorsResponse.data || []);
      
      // Load analytics
      const analyticsResponse = await analyticsApi.getStats();
      setAnalytics(analyticsResponse.data);
      
      // Load all visits
      const visitsResponse = await visitsApi.getAll();
      setAllVisits(visitsResponse.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let patientId = checkInForm.existingPatientId;

      // Create new patient if needed
      if (checkInForm.isNewPatient) {
        const patientData = {
          Name: checkInForm.name,
          Age: parseInt(checkInForm.age),
          Gender: checkInForm.gender,
          Phone: checkInForm.phone,
          BloodGroup: checkInForm.bloodGroup,
          UserID: '' // Walk-in patients don't have user accounts
        };

        const patientResponse = await patientsApi.create(patientData);
        patientId = patientResponse.data.ROWID;
      }

      // Create visit
      const visitData = {
        PatientID: patientId,
        DoctorID: checkInForm.doctorId,
        VisitDate: checkInForm.visitDate,
        Reason: checkInForm.reason,
        Priority: checkInForm.priority
      };

      await visitsApi.create(visitData);

      setSuccess('Patient checked in successfully!');
      
      // Reset form
      setCheckInForm({
        isNewPatient: true,
        existingPatientId: '',
        name: '',
        age: '',
        gender: '',
        phone: '',
        bloodGroup: '',
        doctorId: '',
        visitDate: new Date().toISOString().split('T')[0],
        reason: '',
        priority: 'Normal'
      });

      // Reload data
      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error checking in patient:', err);
      setError(err.message || 'Failed to check in patient');
    }
  };

  const handlePriorityChange = async (visitId, newPriority) => {
    setError('');
    setSuccess('');

    try {
      await visitsApi.update(visitId, { Priority: newPriority });
      setSuccess('Priority updated successfully');
      
      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error updating priority:', err);
      setError(err.message || 'Failed to update priority');
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'Waiting': return 'status-waiting';
      case 'In Consultation': return 'status-in-consultation';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  const waitingVisits = allVisits.filter(v => v.Status === 'Waiting');

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <h1>Admin / Reception Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button 
          className="btn-secondary btn-small" 
          onClick={loadData}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)', 
        marginBottom: 'var(--spacing-xl)',
        borderBottom: '2px solid var(--color-border)'
      }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'analytics' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'analytics' ? '600' : '400',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          📊 Analytics Dashboard
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'checkin' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'checkin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'checkin' ? '600' : '400',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          ➕ Check In Patient
        </button>
        <button
          onClick={() => setActiveTab('queues')}
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'queues' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'queues' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'queues' ? '600' : '400',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          👥 All Queues
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Wait-Time Analytics</h2>
          
          <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="stat-card">
              <div className="stat-value">{analytics.averageWaitTimeToday}</div>
              <div className="stat-label">Avg Wait Time</div>
              <div className="stat-sublabel">minutes (today)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.currentlyWaiting}</div>
              <div className="stat-label">Currently Waiting</div>
              <div className="stat-sublabel">across all doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.longestCurrentWait}</div>
              <div className="stat-label">Longest Wait</div>
              <div className="stat-sublabel">minutes (current)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.completedToday}</div>
              <div className="stat-label">Completed</div>
              <div className="stat-sublabel">visits today</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{analytics.waitingToday}</div>
              <div className="stat-label">Waiting Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.inConsultationToday}</div>
              <div className="stat-label">In Consultation</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.totalVisitsToday}</div>
              <div className="stat-label">Total Visits</div>
              <div className="stat-sublabel">today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{doctors.length}</div>
              <div className="stat-label">Active Doctors</div>
            </div>
          </div>

          <div className="info-message" style={{ marginTop: 'var(--spacing-xl)' }}>
            <strong>Analytics Update:</strong> Data refreshes automatically every 30 seconds. 
            Average wait time is calculated from check-in to consultation start for today's visits.
          </div>
        </div>
      )}

      {/* Check-In Tab */}
      {activeTab === 'checkin' && (
        <div className="dashboard-form">
          <h2>Check In Patient</h2>
          
          <form onSubmit={handleCheckIn}>
            {/* Patient Type Selection */}
            <div className="form-section">
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={checkInForm.isNewPatient}
                    onChange={() => setCheckInForm({ ...checkInForm, isNewPatient: true })}
                    style={{ marginRight: 'var(--spacing-xs)' }}
                  />
                  New Walk-in Patient
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={!checkInForm.isNewPatient}
                    onChange={() => setCheckInForm({ ...checkInForm, isNewPatient: false })}
                    style={{ marginRight: 'var(--spacing-xs)' }}
                  />
                  Existing Patient
                </label>
              </div>
            </div>

            {/* New Patient Form */}
            {checkInForm.isNewPatient && (
              <div className="form-section">
                <h3>Patient Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      value={checkInForm.name}
                      onChange={(e) => setCheckInForm({ ...checkInForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      id="age"
                      type="number"
                      value={checkInForm.age}
                      onChange={(e) => setCheckInForm({ ...checkInForm, age: e.target.value })}
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select
                      id="gender"
                      value={checkInForm.gender}
                      onChange={(e) => setCheckInForm({ ...checkInForm, gender: e.target.value })}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      id="phone"
                      type="tel"
                      value={checkInForm.phone}
                      onChange={(e) => setCheckInForm({ ...checkInForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <select
                    id="bloodGroup"
                    value={checkInForm.bloodGroup}
                    onChange={(e) => setCheckInForm({ ...checkInForm, bloodGroup: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            )}

            {/* Existing Patient Selection */}
            {!checkInForm.isNewPatient && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="existingPatientId">Patient ID *</label>
                  <input
                    id="existingPatientId"
                    type="text"
                    value={checkInForm.existingPatientId}
                    onChange={(e) => setCheckInForm({ ...checkInForm, existingPatientId: e.target.value })}
                    placeholder="Enter patient ROWID"
                    required
                  />
                </div>
              </div>
            )}

            {/* Visit Information */}
            <div className="form-section">
              <h3>Visit Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doctorId">Doctor *</label>
                  <select
                    id="doctorId"
                    value={checkInForm.doctorId}
                    onChange={(e) => setCheckInForm({ ...checkInForm, doctorId: e.target.value })}
                    required
                  >
                    <option value="">Select doctor...</option>
                    {doctors.map(doctor => (
                      <option key={doctor.ROWID} value={doctor.ROWID}>
                        {doctor.Name} - {doctor.Specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="visitDate">Visit Date *</label>
                  <input
                    id="visitDate"
                    type="date"
                    value={checkInForm.visitDate}
                    onChange={(e) => setCheckInForm({ ...checkInForm, visitDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  value={checkInForm.priority}
                  onChange={(e) => setCheckInForm({ ...checkInForm, priority: e.target.value })}
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {checkInForm.priority === 'Urgent' && (
                  <p className="text-muted" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.75rem' }}>
                    ⚠️ Urgent patients will be prioritized in the queue
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason for Visit *</label>
                <textarea
                  id="reason"
                  value={checkInForm.reason}
                  onChange={(e) => setCheckInForm({ ...checkInForm, reason: e.target.value })}
                  placeholder="Describe symptoms or reason for visit..."
                  rows="4"
                  required
                  style={{
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    width: '100%',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Check In Patient
            </button>
          </form>
        </div>
      )}

      {/* All Queues Tab */}
      {activeTab === 'queues' && (
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
            All Waiting Patients ({waitingVisits.length})
          </h2>

          {waitingVisits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <div className="empty-state-message">No patients waiting</div>
            </div>
          ) : (
            <div className="queue-table-container">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Doctor ID</th>
                    <th>Reason</th>
                    <th>Priority</th>
                    <th>Check-in Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingVisits.map(visit => (
                    <tr key={visit.ROWID} style={{
                      backgroundColor: visit.Priority === 'Urgent' ? '#fef3c7' : 'transparent'
                    }}>
                      <td className="monospace">{visit.PatientID.slice(-8)}</td>
                      <td className="monospace">{visit.DoctorID.slice(-8)}</td>
                      <td>{visit.Reason}</td>
                      <td>
                        {visit.Priority === 'Urgent' ? (
                          <span className="status-pill priority-urgent">URGENT</span>
                        ) : (
                          <span className="text-muted">Normal</span>
                        )}
                      </td>
                      <td className="time-info">{formatTime(visit.CheckInTime)}</td>
                      <td>
                        <select
                          value={visit.Priority}
                          onChange={(e) => handlePriorityChange(visit.ROWID, e.target.value)}
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
