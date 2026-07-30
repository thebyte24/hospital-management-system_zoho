import { useState } from 'react';
import '../styles/ModernDashboard.css';

function PatientDashboardNew({ user }) {
  const [activeTab, setActiveTab] = useState('current');
  
  // Patient profile
  const [profile, setProfile] = useState({
    name: user.name,
    age: 30,
    gender: 'Male',
    phone: '+1 234-567-8900',
    bloodGroup: 'A+',
    email: user.email
  });

  // Current visit
  const [currentVisit, setCurrentVisit] = useState({
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialization: 'General Medicine',
    reason: 'Regular checkup',
    priority: 'Normal',
    status: 'Waiting',
    queuePosition: 3,
    estimatedWait: 25,
    checkInTime: '10:30 AM'
  });

  // Visit history
  const [visitHistory, setVisitHistory] = useState([
    { id: 'h1', date: '2026-07-25', doctor: 'Dr. Sarah Johnson', reason: 'Flu symptoms', status: 'Completed', time: '10:30 AM' },
    { id: 'h2', date: '2026-07-20', doctor: 'Dr. Michael Chen', reason: 'Heart checkup', status: 'Completed', time: '02:15 PM' },
    { id: 'h3', date: '2026-07-15', doctor: 'Dr. Emily Brown', reason: 'Vaccination', status: 'Completed', time: '11:00 AM' }
  ]);

  // Available doctors
  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine', available: true },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Cardiology', available: true },
    { id: '3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', available: false }
  ];

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'checkin', 'cancel', 'profile'
  const [checkInData, setCheckInData] = useState({
    doctorId: '',
    reason: '',
    priority: 'Normal'
  });

  const handleCheckIn = () => {
    setModalType('checkin');
    setCheckInData({ doctorId: '', reason: '', priority: 'Normal' });
    setShowModal(true);
  };

  const submitCheckIn = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(d => d.id === checkInData.doctorId);
    
    setCurrentVisit({
      id: Date.now().toString(),
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      reason: checkInData.reason,
      priority: checkInData.priority,
      status: 'Waiting',
      queuePosition: 1,
      estimatedWait: 15,
      checkInTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
    
    setShowModal(false);
    setActiveTab('current');
  };

  const handleCancelVisit = () => {
    setModalType('cancel');
    setShowModal(true);
  };

  const confirmCancel = () => {
    // Add to history as cancelled
    setVisitHistory([
      {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        doctor: currentVisit.doctorName,
        reason: currentVisit.reason,
        status: 'Cancelled',
        time: currentVisit.checkInTime
      },
      ...visitHistory
    ]);
    
    setCurrentVisit(null);
    setShowModal(false);
  };

  const handleEditProfile = () => {
    setModalType('profile');
    setShowModal(true);
  };

  const submitProfile = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="header-title">🏥 Patient Dashboard</h1>
          <p className="header-subtitle">Your Health, Our Priority</p>
        </div>
        <div className="user-info">
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{profile.name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Patient ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid-modern">
        <div className="stat-card-modern info">
          <div className="stat-icon">👤</div>
          <div className="stat-value-modern">{profile.age}</div>
          <div className="stat-label-modern">Age (years)</div>
        </div>
        <div className="stat-card-modern danger">
          <div className="stat-icon">🩸</div>
          <div className="stat-value-modern">{profile.bloodGroup}</div>
          <div className="stat-label-modern">Blood Group</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-icon">📋</div>
          <div className="stat-value-modern">{visitHistory.length}</div>
          <div className="stat-label-modern">Total Visits</div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value-modern">{currentVisit ? currentVisit.estimatedWait : '0'}</div>
          <div className="stat-label-modern">Wait Time (min)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-modern">
        <button className={`tab-button-modern ${activeTab === 'current' ? 'active' : ''}`} onClick={() => setActiveTab('current')}>
          ⏱️ Current Visit
        </button>
        <button className={`tab-button-modern ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 My Profile
        </button>
        <button className={`tab-button-modern ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📋 Visit History
        </button>
      </div>

      {/* Current Visit Tab */}
      {activeTab === 'current' && (
        <>
          {currentVisit ? (
            <div className="modern-card">
              <div className="card-header">
                <h2 className="card-title">
                  <span className="card-icon">⏱️</span>
                  Active Visit
                </h2>
                <button className="btn-modern btn-danger-modern" onClick={handleCancelVisit}>
                  ❌ Cancel Visit
                </button>
              </div>

              <div className="alert-modern alert-success">
                <div>
                  ✅ You're checked in! Please wait for your turn.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>DOCTOR</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentVisit.doctorName}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{currentVisit.specialization}</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>QUEUE POSITION</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>#{currentVisit.queuePosition}</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>EST. WAIT TIME</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)' }}>{currentVisit.estimatedWait}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>minutes</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>STATUS</div>
                  <span className={`badge ${currentVisit.status === 'Waiting' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {currentVisit.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--info-light)', borderRadius: '8px', borderLeft: '4px solid var(--info)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Reason for Visit:</div>
                <div>{currentVisit.reason}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                  Check-in Time: {currentVisit.checkInTime}
                </div>
              </div>
            </div>
          ) : (
            <div className="modern-card">
              <div className="card-header">
                <h2 className="card-title">
                  <span className="card-icon">⏱️</span>
                  Check In
                </h2>
              </div>

              <div className="empty-state-modern">
                <div className="empty-state-icon">🏥</div>
                <div className="empty-state-message">No Active Visit</div>
                <p style={{ marginBottom: '2rem' }}>You don't have any active appointments. Check in to join a doctor's queue.</p>
                <button className="btn-modern btn-primary-modern" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={handleCheckIn}>
                  ➕ Check In Now
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👤</span>
              My Profile
            </h2>
            <button className="btn-modern btn-primary-modern" onClick={handleEditProfile}>
              ✏️ Edit Profile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>FULL NAME</div>
              <div style={{ fontSize: '1.1rem' }}>{profile.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>AGE</div>
              <div style={{ fontSize: '1.1rem' }}>{profile.age} years</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>GENDER</div>
              <div style={{ fontSize: '1.1rem' }}>{profile.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>BLOOD GROUP</div>
              <span className="badge badge-danger" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{profile.bloodGroup}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>PHONE</div>
              <div style={{ fontSize: '1.1rem' }}>{profile.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 600 }}>EMAIL</div>
              <div style={{ fontSize: '1.1rem' }}>{profile.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">📋</span>
              Visit History
            </h2>
          </div>

          {visitHistory.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-message">No Visit History</div>
              <p>Your past visits will appear here</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {visitHistory.map(visit => (
                  <tr key={visit.id}>
                    <td>{formatDate(visit.date)}</td>
                    <td><strong>{visit.doctor}</strong></td>
                    <td>{visit.reason}</td>
                    <td>
                      <span className={`badge ${visit.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                        {visit.status}
                      </span>
                    </td>
                    <td>{visit.time}</td>
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
                {modalType === 'checkin' && '➕ Check In for Visit'}
                {modalType === 'cancel' && '❌ Cancel Visit'}
                {modalType === 'profile' && '✏️ Edit Profile'}
              </h2>
              <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalType === 'checkin' && (
              <form className="form-modern" onSubmit={submitCheckIn}>
                <div className="form-group-modern">
                  <label className="form-label-modern">Select Doctor *</label>
                  <select 
                    className="form-select-modern" 
                    required 
                    value={checkInData.doctorId}
                    onChange={(e) => setCheckInData({...checkInData, doctorId: e.target.value})}
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id} disabled={!doctor.available}>
                        {doctor.name} - {doctor.specialization} {!doctor.available && '(Unavailable)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-modern">
                  <label className="form-label-modern">Reason for Visit *</label>
                  <textarea 
                    className="form-textarea-modern" 
                    rows="4"
                    required
                    placeholder="Describe your symptoms or reason for visit..."
                    value={checkInData.reason}
                    onChange={(e) => setCheckInData({...checkInData, reason: e.target.value})}
                  />
                </div>

                <div className="action-buttons">
                  <button type="submit" className="btn-modern btn-primary-modern">
                    ✅ Check In
                  </button>
                  <button type="button" className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === 'cancel' && (
              <div>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Are you sure you want to cancel your visit with {currentVisit.doctorName}?
                </p>
                <div className="action-buttons">
                  <button className="btn-modern btn-danger-modern" onClick={confirmCancel}>
                    ❌ Yes, Cancel
                  </button>
                  <button className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    No, Keep It
                  </button>
                </div>
              </div>
            )}

            {modalType === 'profile' && (
              <form className="form-modern" onSubmit={submitProfile}>
                <div className="form-group-modern">
                  <label className="form-label-modern">Full Name *</label>
                  <input 
                    className="form-input-modern" 
                    required 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group-modern">
                    <label className="form-label-modern">Age *</label>
                    <input 
                      type="number" 
                      className="form-input-modern" 
                      required 
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: e.target.value})}
                    />
                  </div>
                  <div className="form-group-modern">
                    <label className="form-label-modern">Gender *</label>
                    <select 
                      className="form-select-modern" 
                      required 
                      value={profile.gender}
                      onChange={(e) => setProfile({...profile, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group-modern">
                    <label className="form-label-modern">Phone *</label>
                    <input 
                      type="tel" 
                      className="form-input-modern" 
                      required 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group-modern">
                    <label className="form-label-modern">Blood Group</label>
                    <select 
                      className="form-select-modern" 
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                    >
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
                <div className="action-buttons">
                  <button type="submit" className="btn-modern btn-primary-modern">
                    💾 Save Changes
                  </button>
                  <button type="button" className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboardNew;
