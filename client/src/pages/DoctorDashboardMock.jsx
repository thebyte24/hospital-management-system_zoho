import { useState } from 'react';
import '../styles/Dashboard.css';

function DoctorDashboardMock({ user }) {
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Mock data
  const doctor = {
    Name: user.name,
    Specialization: 'General Medicine',
    Email: user.email,
    Phone: '+1 234-567-8900',
    ROWID: '1'
  };

  const queue = [
    {
      ROWID: '1',
      PatientName: 'John Doe',
      Age: 35,
      Gender: 'Male',
      Reason: 'Fever and cough for 3 days',
      Priority: 'Urgent',
      CheckInTime: '2026-07-30T10:15:00',
      Status: 'Waiting',
      queuePosition: 1,
      estimatedWaitMinutes: 5
    },
    {
      ROWID: '2',
      PatientName: 'Jane Smith',
      Age: 28,
      Gender: 'Female',
      Reason: 'Regular health checkup',
      Priority: 'Normal',
      CheckInTime: '2026-07-30T10:20:00',
      Status: 'Waiting',
      queuePosition: 2,
      estimatedWaitMinutes: 20
    },
    {
      ROWID: '3',
      PatientName: 'Robert Johnson',
      Age: 45,
      Gender: 'Male',
      Reason: 'Follow-up consultation',
      Priority: 'Normal',
      CheckInTime: '2026-07-30T10:30:00',
      Status: 'Waiting',
      queuePosition: 3,
      estimatedWaitMinutes: 35
    }
  ];

  const stats = {
    totalWaiting: 3,
    totalUrgent: 1,
    avgWaitTime: 20,
    completedToday: 8
  };

  const handleStartConsultation = (visit) => {
    alert(`Starting consultation with ${visit.PatientName}`);
  };

  const handleCompleteConsultation = (visit) => {
    alert(`Consultation completed for ${visit.PatientName}`);
    setSelectedVisit(null);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard">
      <h1>Doctor Dashboard</h1>
      <p>Welcome, {doctor.Name}!</p>

      {/* Doctor Profile Card */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>My Profile</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <p><strong>Name:</strong> {doctor.Name}</p>
          <p><strong>Specialization:</strong> {doctor.Specialization}</p>
          <p><strong>Email:</strong> {doctor.Email}</p>
          <p><strong>Phone:</strong> {doctor.Phone}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="stat-card">
          <div className="stat-value">{stats.totalWaiting}</div>
          <div className="stat-label">Patients Waiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{stats.totalUrgent}</div>
          <div className="stat-label">Urgent Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgWaitTime}</div>
          <div className="stat-label">Avg Wait (min)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedToday}</div>
          <div className="stat-label">Completed Today</div>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2>Patient Queue</h2>
          <span className="text-muted">{queue.length} patients waiting</span>
        </div>

        <div className="queue-table-container">
          <table className="queue-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Age/Gender</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Check-in Time</th>
                <th>Wait Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <div className="empty-state">
                      <div className="empty-state-message">No patients in queue</div>
                      <p className="text-muted">Patients will appear here when they check in</p>
                    </div>
                  </td>
                </tr>
              ) : (
                queue.map((visit, index) => (
                  <tr key={visit.ROWID} className={visit.Priority === 'Urgent' ? 'priority-urgent-row' : ''}>
                    <td><strong>{index + 1}</strong></td>
                    <td>{visit.PatientName}</td>
                    <td>{visit.Age} / {visit.Gender}</td>
                    <td>{visit.Reason}</td>
                    <td>
                      <span className={`status-pill ${visit.Priority === 'Urgent' ? 'priority-urgent' : 'priority-normal'}`}>
                        {visit.Priority}
                      </span>
                    </td>
                    <td className="time-info">{formatTime(visit.CheckInTime)}</td>
                    <td>{visit.estimatedWaitMinutes} min</td>
                    <td>
                      {visit.Status === 'Waiting' && (
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          onClick={() => handleStartConsultation(visit)}
                        >
                          Start
                        </button>
                      )}
                      {visit.Status === 'In Consultation' && (
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          onClick={() => handleCompleteConsultation(visit)}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboardMock;
