import { useState, useEffect } from 'react';
import { patientsApi, doctorsApi, visitsApi } from '../utils/api';
import '../styles/Dashboard.css';

function PatientDashboard({ user }) {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentVisit, setCurrentVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Check-in form state
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [checkInData, setCheckInData] = useState({
    doctorId: '',
    reason: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadPatientData();
    loadDoctors();
  }, [user]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      
      // Get patient record linked to this user
      const patientsResponse = await patientsApi.getAll(user.id);
      const patientRecord = patientsResponse.data?.[0];
      
      if (patientRecord) {
        setPatient(patientRecord);
        
        // Load visits for this patient
        const visitsResponse = await visitsApi.getAll({ patientId: patientRecord.ROWID });
        setVisits(visitsResponse.data || []);
        
        // Find current waiting or in-consultation visit
        const activeVisit = visitsResponse.data?.find(
          v => v.Status === 'Waiting' || v.Status === 'In Consultation'
        );
        
        if (activeVisit) {
          // Get detailed visit info with queue position
          const visitDetails = await visitsApi.getById(activeVisit.ROWID);
          setCurrentVisit(visitDetails.data);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading patient data:', err);
      setError(err.message || 'Failed to load patient data');
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorsApi.getAll();
      setDoctors(response.data || []);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create visit (check-in)
      const visitData = {
        PatientID: patient.ROWID,
        DoctorID: checkInData.doctorId,
        VisitDate: checkInData.visitDate,
        Reason: checkInData.reason,
        Priority: 'Normal' // Patients can only set Normal priority
      };

      await visitsApi.create(visitData);
      
      setSuccess('Successfully checked in! You have been added to the queue.');
      setShowCheckInForm(false);
      setCheckInData({
        doctorId: '',
        reason: '',
        visitDate: new Date().toISOString().split('T')[0]
      });
      
      // Reload data to show updated queue status
      setTimeout(() => {
        loadPatientData();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error checking in:', err);
      setError(err.message || 'Failed to check in');
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

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading patient information...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="dashboard">
        <h1>Patient Dashboard</h1>
        <div className="error-message">
          No patient record found for your account. Please contact reception to set up your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Patient Dashboard</h1>
      <p>Welcome, {patient.Name}!</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>My Profile</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div className="patient-info">
            <p><strong>Name:</strong> {patient.Name}</p>
            <p><strong>Age:</strong> {patient.Age} years</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>
            <p><strong>Phone:</strong> {patient.Phone}</p>
            {patient.BloodGroup && <p><strong>Blood Group:</strong> {patient.BloodGroup}</p>}
            <p className="patient-details">Patient ID: {patient.ROWID}</p>
          </div>
        </div>
      </div>

      {/* Current Visit Status */}
      {currentVisit ? (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)', borderLeft: '4px solid var(--color-primary)' }}>
          <h2>Current Visit Status</h2>
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{currentVisit.queuePosition || '—'}</div>
                <div className="stat-label">Queue Position</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{currentVisit.estimatedWaitMinutes || 0}</div>
                <div className="stat-label">Est. Wait (min)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  <span className={`status-pill ${getStatusClass(currentVisit.Status)}`}>
                    {currentVisit.Status}
                  </span>
                </div>
                <div className="stat-label">Status</div>
              </div>
            </div>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <p><strong>Doctor:</strong> Loading...</p>
              <p><strong>Reason:</strong> {currentVisit.Reason}</p>
              <p><strong>Check-in Time:</strong> {formatTime(currentVisit.CheckInTime)}</p>
              {currentVisit.Priority === 'Urgent' && (
                <span className="status-pill priority-urgent" style={{ marginTop: 'var(--spacing-sm)' }}>
                  URGENT
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2>Check In</h2>
          {!showCheckInForm ? (
            <div>
              <p style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                You don't have any active appointments. Check in to join a doctor's queue.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => setShowCheckInForm(true)}
              >
                Check In Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckIn} style={{ marginTop: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="doctorId">Select Doctor *</label>
                <select
                  id="doctorId"
                  value={checkInData.doctorId}
                  onChange={(e) => setCheckInData({ ...checkInData, doctorId: e.target.value })}
                  required
                >
                  <option value="">Choose a doctor...</option>
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
                  value={checkInData.visitDate}
                  onChange={(e) => setCheckInData({ ...checkInData, visitDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Visit *</label>
                <textarea
                  id="reason"
                  value={checkInData.reason}
                  onChange={(e) => setCheckInData({ ...checkInData, reason: e.target.value })}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows="4"
                  required
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    width: '100%',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <button type="submit" className="btn-primary">
                  Confirm Check-In
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCheckInForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Visit History */}
      <div className="card">
        <h2>Visit History</h2>
        {visits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-message">No visits yet</div>
            <p className="text-muted">Your visit history will appear here</p>
          </div>
        ) : (
          <div className="queue-table-container" style={{ marginTop: 'var(--spacing-md)' }}>
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Check-in</th>
                </tr>
              </thead>
              <tbody>
                {visits.slice(0, 10).map(visit => (
                  <tr key={visit.ROWID}>
                    <td>{formatDate(visit.VisitDate)}</td>
                    <td>Doctor #{visit.DoctorID.slice(-4)}</td>
                    <td>{visit.Reason}</td>
                    <td>
                      <span className={`status-pill ${getStatusClass(visit.Status)}`}>
                        {visit.Status}
                      </span>
                    </td>
                    <td className="time-info">{formatTime(visit.CheckInTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
