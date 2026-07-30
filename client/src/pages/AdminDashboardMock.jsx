import { useState } from 'react';
import '../styles/Dashboard.css';

function AdminDashboardMock({ user }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [checkInData, setCheckInData] = useState({
    patientId: '',
    doctorId: '',
    priority: 'Normal',
    reason: ''
  });

  // Mock data
  const analytics = {
    totalPatientsToday: 24,
    totalWaiting: 5,
    avgWaitTime: 18,
    completedToday: 19
  };

  const patients = [
    { ROWID: '1', Name: 'John Doe', Age: 35, Gender: 'Male', Phone: '+1 234-567-8901' },
    { ROWID: '2', Name: 'Jane Smith', Age: 28, Gender: 'Female', Phone: '+1 234-567-8902' },
    { ROWID: '3', Name: 'Robert Johnson', Age: 45, Gender: 'Male', Phone: '+1 234-567-8903' }
  ];

  const doctors = [
    { ROWID: '1', Name: 'Dr. Sarah Johnson', Specialization: 'General Medicine' },
    { ROWID: '2', Name: 'Dr. Michael Chen', Specialization: 'Cardiology' },
    { ROWID: '3', Name: 'Dr. Emily Brown', Specialization: 'Pediatrics' }
  ];

  const allQueue = [
    {
      ROWID: '1',
      PatientName: 'John Doe',
      DoctorName: 'Dr. Sarah Johnson',
      Reason: 'Fever and cough',
      Priority: 'Urgent',
      Status: 'Waiting',
      CheckInTime: '2026-07-30T10:15:00',
      queuePosition: 1
    },
    {
      ROWID: '2',
      PatientName: 'Jane Smith',
      DoctorName: 'Dr. Michael Chen',
      Reason: 'Heart checkup',
      Priority: 'Normal',
      Status: 'In Consultation',
      CheckInTime: '2026-07-30T10:20:00',
      queuePosition: 1
    },
    {
      ROWID: '3',
      PatientName: 'Robert Johnson',
      DoctorName: 'Dr. Sarah Johnson',
      Reason: 'Follow-up',
      Priority: 'Normal',
      Status: 'Waiting',
      CheckInTime: '2026-07-30T10:30:00',
      queuePosition: 2
    }
  ];

  const handleCheckIn = (e) => {
    e.preventDefault();
    alert('Patient checked in successfully!');
    setShowCheckInForm(false);
    setCheckInData({
      patientId: '',
      doctorId: '',
      priority: 'Normal',
      reason: ''
    });
  };

  const handleUpdatePriority = (visitId, newPriority) => {
    alert(`Priority updated to ${newPriority} for visit ${visitId}`);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard">
      <h1>Admin / Reception Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'checkin' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          ➕ Check In Patient
        </button>
        <button
          className={`tab-button ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          👥 All Queues
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Stats Cards */}
          <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="stat-card">
              <div className="stat-value">{analytics.totalPatientsToday}</div>
              <div className="stat-label">Total Patients Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
                {analytics.totalWaiting}
              </div>
              <div className="stat-label">Currently Waiting</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.avgWaitTime}</div>
              <div className="stat-label">Avg Wait Time (min)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>
                {analytics.completedToday}
              </div>
              <div className="stat-label">Completed Today</div>
            </div>
          </div>

          {/* Charts placeholder */}
          <div className="card">
            <h2>Today's Activity</h2>
            <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>
              <p>📈 Analytics charts would appear here</p>
              <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                Showing patient flow, wait times, and doctor performance
              </p>
            </div>
          </div>
        </>
      )}

      {/* Check In Tab */}
      {activeTab === 'checkin' && (
        <div className="card">
          <h2>Check In Patient</h2>

          <div style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <label>
              <input
                type="radio"
                checked={!showCheckInForm}
                onChange={() => setShowCheckInForm(false)}
                style={{ marginRight: '0.5rem' }}
              />
              New Walk-in Patient
            </label>
            <label style={{ marginLeft: 'var(--spacing-lg)' }}>
              <input
                type="radio"
                checked={showCheckInForm}
                onChange={() => setShowCheckInForm(true)}
                style={{ marginRight: '0.5rem' }}
              />
              Existing Patient
            </label>
          </div>

          <form onSubmit={handleCheckIn}>
            {showCheckInForm && (
              <div className="form-group">
                <label htmlFor="patientId">Select Patient *</label>
                <select
                  id="patientId"
                  value={checkInData.patientId}
                  onChange={(e) => setCheckInData({ ...checkInData, patientId: e.target.value })}
                  required
                >
                  <option value="">Choose a patient...</option>
                  {patients.map(patient => (
                    <option key={patient.ROWID} value={patient.ROWID}>
                      {patient.Name} - {patient.Age}y {patient.Gender}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!showCheckInForm && (
              <>
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name *</label>
                  <input
                    id="patientName"
                    type="text"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input id="age" type="number" placeholder="Age" min="1" max="120" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select id="gender" required>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input id="phone" type="tel" placeholder="Phone number" required />
                </div>
              </>
            )}

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
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                value={checkInData.priority}
                onChange={(e) => setCheckInData({ ...checkInData, priority: e.target.value })}
                required
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit *</label>
              <textarea
                id="reason"
                value={checkInData.reason}
                onChange={(e) => setCheckInData({ ...checkInData, reason: e.target.value })}
                placeholder="Describe symptoms or reason for visit..."
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

            <button type="submit" className="btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
              Check In Patient
            </button>
          </form>
        </div>
      )}

      {/* All Queues Tab */}
      {activeTab === 'queue' && (
        <div className="card">
          <h2>All Waiting Patients ({allQueue.length})</h2>

          <div className="queue-table-container" style={{ marginTop: 'var(--spacing-md)' }}>
            <table className="queue-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allQueue.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                      <div className="empty-state">
                        <div className="empty-state-message">No patients in queue</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allQueue.map((visit, index) => (
                    <tr key={visit.ROWID} className={visit.Priority === 'Urgent' ? 'priority-urgent-row' : ''}>
                      <td><strong>{index + 1}</strong></td>
                      <td>{visit.PatientName}</td>
                      <td>{visit.DoctorName}</td>
                      <td>{visit.Reason}</td>
                      <td>
                        <select
                          value={visit.Priority}
                          onChange={(e) => handleUpdatePriority(visit.ROWID, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: visit.Priority === 'Urgent' ? '#fee' : '#efe'
                          }}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-pill status-${visit.Status.toLowerCase().replace(' ', '-')}`}>
                          {visit.Status}
                        </span>
                      </td>
                      <td className="time-info">{formatTime(visit.CheckInTime)}</td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          onClick={() => alert(`View details for ${visit.PatientName}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardMock;
