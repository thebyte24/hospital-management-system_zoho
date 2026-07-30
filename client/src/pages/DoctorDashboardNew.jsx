import { useState } from 'react';
import '../styles/ModernDashboard.css';

function DoctorDashboardNew({ user }) {
  const [activeTab, setActiveTab] = useState('queue');
  
  // State for queue
  const [queue, setQueue] = useState([
    { id: '1', patientName: 'John Doe', age: 35, gender: 'Male', reason: 'Fever and cough for 3 days', priority: 'Urgent', status: 'Waiting', time: '10:15 AM', notes: '' },
    { id: '2', patientName: 'Jane Smith', age: 28, gender: 'Female', reason: 'Regular health checkup', priority: 'Normal', status: 'Waiting', time: '10:20 AM', notes: '' },
    { id: '3', patientName: 'Robert Johnson', age: 45, gender: 'Male', reason: 'Follow-up consultation', priority: 'Normal', status: 'Waiting', time: '10:30 AM', notes: '' }
  ]);

  // Completed patients today
  const [completed, setCompleted] = useState([
    { id: 'c1', patientName: 'Alice Brown', age: 32, reason: 'Headache', time: '09:00 AM', notes: 'Prescribed medication' },
    { id: 'c2', patientName: 'Bob Wilson', age: 50, reason: 'Diabetes checkup', time: '09:30 AM', notes: 'Blood sugar levels normal' }
  ]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'start', 'complete', 'notes'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState('');

  const stats = {
    waiting: queue.filter(p => p.status === 'Waiting').length,
    urgent: queue.filter(p => p.priority === 'Urgent').length,
    avgWaitTime: 20,
    completedToday: completed.length
  };

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setModalType('start');
    setShowModal(true);
  };

  const confirmStart = () => {
    setQueue(queue.map(p => 
      p.id === selectedPatient.id ? { ...p, status: 'In Consultation' } : p
    ));
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleCompleteConsultation = (patient) => {
    setSelectedPatient(patient);
    setModalType('complete');
    setConsultationNotes('');
    setShowModal(true);
  };

  const confirmComplete = () => {
    // Move to completed
    const completedPatient = {
      ...selectedPatient,
      notes: consultationNotes,
      completedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setCompleted([completedPatient, ...completed]);
    setQueue(queue.filter(p => p.id !== selectedPatient.id));
    setShowModal(false);
    setSelectedPatient(null);
    setConsultationNotes('');
  };

  const handleViewNotes = (patient) => {
    setSelectedPatient(patient);
    setModalType('notes');
    setShowModal(true);
  };

  const handleRemoveFromQueue = (patient) => {
    if (window.confirm(`Remove ${patient.patientName} from queue?`)) {
      setQueue(queue.filter(p => p.id !== patient.id));
    }
  };

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="header-title">👨‍⚕️ Doctor Dashboard</h1>
          <p className="header-subtitle">Patient Queue & Management</p>
        </div>
        <div className="user-info">
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>General Medicine</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern">
        <div className="stat-card-modern warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value-modern">{stats.waiting}</div>
          <div className="stat-label-modern">Patients Waiting</div>
        </div>
        <div className="stat-card-modern danger">
          <div className="stat-icon">🚨</div>
          <div className="stat-value-modern">{stats.urgent}</div>
          <div className="stat-label-modern">Urgent Cases</div>
        </div>
        <div className="stat-card-modern info">
          <div className="stat-icon">⏰</div>
          <div className="stat-value-modern">{stats.avgWaitTime}</div>
          <div className="stat-label-modern">Avg Wait (min)</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-icon">✅</div>
          <div className="stat-value-modern">{stats.completedToday}</div>
          <div className="stat-label-modern">Completed Today</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-modern">
        <button className={`tab-button-modern ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}>
          👥 Patient Queue ({queue.length})
        </button>
        <button className={`tab-button-modern ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          ✅ Completed Today ({completed.length})
        </button>
      </div>

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👥</span>
              Current Queue
            </h2>
          </div>

          {queue.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-state-icon">😊</div>
              <div className="empty-state-message">No Patients in Queue</div>
              <p>All caught up! Take a well-deserved break.</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Age/Gender</th>
                  <th>Reason</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((patient, index) => (
                  <tr key={patient.id} style={{ position: 'relative' }}>
                    {patient.priority === 'Urgent' && <div className="priority-indicator priority-urgent-indicator"></div>}
                    <td><strong>{index + 1}</strong></td>
                    <td><strong>{patient.patientName}</strong></td>
                    <td>{patient.age} / {patient.gender}</td>
                    <td>{patient.reason}</td>
                    <td>
                      <span className={`badge ${patient.priority === 'Urgent' ? 'badge-urgent' : 'badge-success'}`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${patient.status === 'Waiting' ? 'badge-warning' : 'badge-info'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>{patient.time}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {patient.status === 'Waiting' && (
                          <button 
                            className="btn-modern btn-success-modern" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleStartConsultation(patient)}
                          >
                            ▶️ Start
                          </button>
                        )}
                        {patient.status === 'In Consultation' && (
                          <button 
                            className="btn-modern btn-primary-modern" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleCompleteConsultation(patient)}
                          >
                            ✅ Complete
                          </button>
                        )}
                        <button 
                          className="btn-modern btn-danger-modern btn-icon" 
                          onClick={() => handleRemoveFromQueue(patient)}
                          title="Remove"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">✅</span>
              Completed Consultations
            </h2>
          </div>

          {completed.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-message">No Completed Consultations</div>
              <p>Completed consultations will appear here</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Reason</th>
                  <th>Time</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((patient) => (
                  <tr key={patient.id}>
                    <td><strong>{patient.patientName}</strong></td>
                    <td>{patient.age}</td>
                    <td>{patient.reason}</td>
                    <td>{patient.time} - {patient.completedAt}</td>
                    <td>{patient.notes ? patient.notes.substring(0, 30) + '...' : 'No notes'}</td>
                    <td>
                      <button 
                        className="btn-modern btn-secondary-modern" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={() => handleViewNotes(patient)}
                      >
                        📄 View Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'start' && '▶️ Start Consultation'}
                {modalType === 'complete' && '✅ Complete Consultation'}
                {modalType === 'notes' && '📄 Consultation Notes'}
              </h2>
              <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalType === 'start' && selectedPatient && (
              <div>
                <div className="alert-modern alert-info" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Patient:</strong> {selectedPatient.patientName}<br />
                    <strong>Reason:</strong> {selectedPatient.reason}
                  </div>
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Ready to start consultation with {selectedPatient.patientName}?
                </p>
                <div className="action-buttons">
                  <button className="btn-modern btn-success-modern" onClick={confirmStart}>
                    ▶️ Start Consultation
                  </button>
                  <button className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {modalType === 'complete' && selectedPatient && (
              <div>
                <div className="alert-modern alert-success" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Patient:</strong> {selectedPatient.patientName}<br />
                    <strong>Reason:</strong> {selectedPatient.reason}
                  </div>
                </div>
                <form className="form-modern" onSubmit={(e) => { e.preventDefault(); confirmComplete(); }}>
                  <div className="form-group-modern">
                    <label className="form-label-modern">Consultation Notes</label>
                    <textarea 
                      className="form-textarea-modern" 
                      rows="6"
                      placeholder="Enter diagnosis, prescribed medications, follow-up instructions..."
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                    />
                  </div>
                  <div className="action-buttons">
                    <button type="submit" className="btn-modern btn-primary-modern">
                      ✅ Complete & Save
                    </button>
                    <button type="button" className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modalType === 'notes' && selectedPatient && (
              <div>
                <div className="alert-modern alert-info" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Patient:</strong> {selectedPatient.patientName}<br />
                    <strong>Age:</strong> {selectedPatient.age}<br />
                    <strong>Reason:</strong> {selectedPatient.reason}<br />
                    <strong>Time:</strong> {selectedPatient.time} - {selectedPatient.completedAt}
                  </div>
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">Consultation Notes</label>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'var(--gray-50)', 
                    borderRadius: '8px',
                    minHeight: '150px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedPatient.notes || 'No notes recorded'}
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboardNew;
