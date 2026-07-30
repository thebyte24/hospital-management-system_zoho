import { useState } from 'react';
import '../styles/Dashboard.css';

function PatientDashboardMock({ user }) {
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [checkInData, setCheckInData] = useState({
    doctorId: '',
    reason: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  // Mock data
  const patient = {
    Name: user.name,
    Age: 30,
    Gender: 'Male',
    Phone: '+1 234-567-8900',
    BloodGroup: 'A+',
    ROWID: '001'
  };

  const doctors = [
    { ROWID: '1', Name: 'Dr. Sarah Johnson', Specialization: 'General Medicine' },
    { ROWID: '2', Name: 'Dr. Michael Chen', Specialization: 'Cardiology' },
    { ROWID: '3', Name: 'Dr. Emily Brown', Specialization: 'Pediatrics' }
  ];

  const currentVisit = {
    queuePosition: 3,
    estimatedWaitMinutes: 25,
    Status: 'Waiting',
    Reason: 'Regular checkup',
    CheckInTime: new Date().toISOString(),
    Priority: 'Normal'
  };

  const visits = [
    {
      ROWID: '1',
      VisitDate: '2026-07-25',
      DoctorID: '1',
      Reason: 'Flu symptoms',
      Status: 'Completed',
      CheckInTime: '2026-07-25T10:30:00'
    },
    {
      ROWID: '2',
      VisitDate: '2026-07-20',
      DoctorID: '2',
      Reason: 'Heart checkup',
      Status: 'Completed',
      CheckInTime: '2026-07-20T14:15:00'
    }
  ];

  const handleCheckIn = (e) => {
    e.preventDefault();
    alert('Check-in successful! You have been added to the queue.');
    setShowCheckInForm(false);
    setCheckInData({
      doctorId: '',
      reason: '',
      visitDate: new Date().toISOString().split('T')[0]
    });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard">
      <h1>Patient Dashboard</h1>
      <p>Welcome, {patient.Name}!</p>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>My Profile</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div className="patient-info">
            <p><strong>Name:</strong> {patient.Name}</p>
            <p><strong>Age:</strong> {patient.Age} years</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>
            <p><strong>Phone:</strong> {patient.Phone}</p>
            <p><strong>Blood Group:</strong> {patient.BloodGroup}</p>
            <p className="patient-details">Patient ID: {patient.ROWID}</p>
          </div>
        </div>
      </div>

      {/* Current Visit Status */}
      {currentVisit && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)', borderLeft: '4px solid var(--color-primary)' }}>
          <h2>Current Visit Status</h2>
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{currentVisit.queuePosition}</div>
                <div className="stat-label">Queue Position</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{currentVisit.estimatedWaitMinutes}</div>
                <div className="stat-label">Est. Wait (min)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  <span className="status-pill status-waiting">{currentVisit.Status}</span>
                </div>
                <div className="stat-label">Status</div>
              </div>
            </div>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
              <p><strong>Reason:</strong> {currentVisit.Reason}</p>
              <p><strong>Check-in Time:</strong> {formatTime(currentVisit.CheckInTime)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Check In Form */}
      {!currentVisit && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2>Check In</h2>
          {!showCheckInForm ? (
            <div>
              <p style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                You don't have any active appointments. Check in to join a doctor's queue.
              </p>
              <button className="btn-primary" onClick={() => setShowCheckInForm(true)}>
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
                <button type="button" className="btn-secondary" onClick={() => setShowCheckInForm(false)}>
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
              {visits.map(visit => (
                <tr key={visit.ROWID}>
                  <td>{formatDate(visit.VisitDate)}</td>
                  <td>Dr. Sarah Johnson</td>
                  <td>{visit.Reason}</td>
                  <td>
                    <span className="status-pill status-completed">{visit.Status}</span>
                  </td>
                  <td className="time-info">{formatTime(visit.CheckInTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboardMock;
