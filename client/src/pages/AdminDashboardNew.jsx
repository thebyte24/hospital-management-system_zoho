import { useState } from 'react';
import '../styles/ModernDashboard.css';

function AdminDashboardNew({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for patients
  const [patients, setPatients] = useState([
    { id: '1', name: 'John Doe', age: 35, gender: 'Male', phone: '+1 234-567-8901', bloodGroup: 'A+' },
    { id: '2', name: 'Jane Smith', age: 28, gender: 'Female', phone: '+1 234-567-8902', bloodGroup: 'O+' },
    { id: '3', name: 'Robert Johnson', age: 45, gender: 'Male', phone: '+1 234-567-8903', bloodGroup: 'B+' }
  ]);
  
  // State for doctors
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine', email: 'sarah@hospital.com', phone: '+1 234-567-9001' },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Cardiology', email: 'michael@hospital.com', phone: '+1 234-567-9002' },
    { id: '3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', email: 'emily@hospital.com', phone: '+1 234-567-9003' }
  ]);
  
  // State for visits
  const [visits, setVisits] = useState([
    { id: '1', patientName: 'John Doe', doctorName: 'Dr. Sarah Johnson', reason: 'Fever and cough', priority: 'Urgent', status: 'Waiting', time: '10:15 AM' },
    { id: '2', patientName: 'Jane Smith', doctorName: 'Dr. Michael Chen', reason: 'Heart checkup', priority: 'Normal', status: 'In Consultation', time: '10:20 AM' },
    { id: '3', patientName: 'Robert Johnson', doctorName: 'Dr. Sarah Johnson', reason: 'Follow-up', priority: 'Normal', status: 'Waiting', time: '10:30 AM' }
  ]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'
  const [currentEntity, setCurrentEntity] = useState(''); // 'patient', 'doctor', 'visit'
  const [formData, setFormData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const stats = {
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    activeVisits: visits.filter(v => v.status !== 'Completed').length,
    urgentCases: visits.filter(v => v.priority === 'Urgent').length
  };

  // CRUD Operations
  const handleAdd = (entity) => {
    setCurrentEntity(entity);
    setModalType('add');
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (entity, item) => {
    setCurrentEntity(entity);
    setModalType('edit');
    setSelectedItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (entity, item) => {
    setCurrentEntity(entity);
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newItem = { ...formData, id: Date.now().toString() };
      if (currentEntity === 'patient') {
        setPatients([...patients, newItem]);
      } else if (currentEntity === 'doctor') {
        setDoctors([...doctors, newItem]);
      } else if (currentEntity === 'visit') {
        setVisits([...visits, newItem]);
      }
    } else if (modalType === 'edit') {
      if (currentEntity === 'patient') {
        setPatients(patients.map(p => p.id === selectedItem.id ? formData : p));
      } else if (currentEntity === 'doctor') {
        setDoctors(doctors.map(d => d.id === selectedItem.id ? formData : d));
      } else if (currentEntity === 'visit') {
        setVisits(visits.map(v => v.id === selectedItem.id ? formData : v));
      }
    }
    
    setShowModal(false);
    setFormData({});
    setSelectedItem(null);
  };

  const confirmDelete = () => {
    if (currentEntity === 'patient') {
      setPatients(patients.filter(p => p.id !== selectedItem.id));
    } else if (currentEntity === 'doctor') {
      setDoctors(doctors.filter(d => d.id !== selectedItem.id));
    } else if (currentEntity === 'visit') {
      setVisits(visits.filter(v => v.id !== selectedItem.id));
    }
    
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="header-title">🏥 Admin Dashboard</h1>
          <p className="header-subtitle">Hospital Queue Management System</p>
        </div>
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern">
        <div className="stat-card-modern">
          <div className="stat-icon">👥</div>
          <div className="stat-value-modern">{stats.totalPatients}</div>
          <div className="stat-label-modern">Total Patients</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-value-modern">{stats.totalDoctors}</div>
          <div className="stat-label-modern">Total Doctors</div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value-modern">{stats.activeVisits}</div>
          <div className="stat-label-modern">Active Visits</div>
        </div>
        <div className="stat-card-modern danger">
          <div className="stat-icon">🚨</div>
          <div className="stat-value-modern">{stats.urgentCases}</div>
          <div className="stat-label-modern">Urgent Cases</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-modern">
        <button className={`tab-button-modern ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={`tab-button-modern ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
          👥 Patients
        </button>
        <button className={`tab-button-modern ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
          👨‍⚕️ Doctors
        </button>
        <button className={`tab-button-modern ${activeTab === 'visits' ? 'active' : ''}`} onClick={() => setActiveTab('visits')}>
          📋 Visits
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">📈</span>
              Today's Overview
            </h2>
          </div>
          <div className="empty-state-modern">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-message">Analytics Dashboard</div>
            <p>View real-time statistics and performance metrics here</p>
          </div>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👥</span>
              Manage Patients
            </h2>
            <button className="btn-modern btn-primary-modern" onClick={() => handleAdd('patient')}>
              ➕ Add Patient
            </button>
          </div>
          
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td><strong>{patient.name}</strong></td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td><span className="badge badge-info">{patient.bloodGroup}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-modern btn-secondary-modern btn-icon" onClick={() => handleEdit('patient', patient)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-modern btn-danger-modern btn-icon" onClick={() => handleDelete('patient', patient)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👨‍⚕️</span>
              Manage Doctors
            </h2>
            <button className="btn-modern btn-primary-modern" onClick={() => handleAdd('doctor')}>
              ➕ Add Doctor
            </button>
          </div>
          
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td><strong>{doctor.name}</strong></td>
                  <td><span className="badge badge-success">{doctor.specialization}</span></td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-modern btn-secondary-modern btn-icon" onClick={() => handleEdit('doctor', doctor)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-modern btn-danger-modern btn-icon" onClick={() => handleDelete('doctor', doctor)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div className="modern-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">📋</span>
              Manage Visits
            </h2>
            <button className="btn-modern btn-primary-modern" onClick={() => handleAdd('visit')}>
              ➕ Add Visit
            </button>
          </div>
          
          <table className="modern-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(visit => (
                <tr key={visit.id}>
                  <td><strong>{visit.patientName}</strong></td>
                  <td>{visit.doctorName}</td>
                  <td>{visit.reason}</td>
                  <td>
                    <span className={`badge ${visit.priority === 'Urgent' ? 'badge-urgent' : 'badge-success'}`}>
                      {visit.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${visit.status === 'Waiting' ? 'badge-warning' : visit.status === 'In Consultation' ? 'badge-info' : 'badge-success'}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td>{visit.time}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-modern btn-secondary-modern btn-icon" onClick={() => handleEdit('visit', visit)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-modern btn-danger-modern btn-icon" onClick={() => handleDelete('visit', visit)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'delete' ? '🗑️ Confirm Delete' : 
                 modalType === 'add' ? `➕ Add ${currentEntity.charAt(0).toUpperCase() + currentEntity.slice(1)}` :
                 `✏️ Edit ${currentEntity.charAt(0).toUpperCase() + currentEntity.slice(1)}`}
              </h2>
              <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalType === 'delete' ? (
              <div>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Are you sure you want to delete this {currentEntity}?
                </p>
                <div className="action-buttons">
                  <button className="btn-modern btn-danger-modern" onClick={confirmDelete}>
                    🗑️ Delete
                  </button>
                  <button className="btn-modern btn-secondary-modern" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form className="form-modern" onSubmit={handleSubmit}>
                {currentEntity === 'patient' && (
                  <>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Name *</label>
                      <input 
                        className="form-input-modern" 
                        required 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group-modern">
                        <label className="form-label-modern">Age *</label>
                        <input 
                          type="number" 
                          className="form-input-modern" 
                          required 
                          value={formData.age || ''} 
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                      </div>
                      <div className="form-group-modern">
                        <label className="form-label-modern">Gender *</label>
                        <select 
                          className="form-select-modern" 
                          required 
                          value={formData.gender || ''} 
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="">Select...</option>
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
                          value={formData.phone || ''} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="form-group-modern">
                        <label className="form-label-modern">Blood Group</label>
                        <select 
                          className="form-select-modern" 
                          value={formData.bloodGroup || ''} 
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
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
                  </>
                )}

                {currentEntity === 'doctor' && (
                  <>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Name *</label>
                      <input 
                        className="form-input-modern" 
                        required 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Specialization *</label>
                      <input 
                        className="form-input-modern" 
                        required 
                        value={formData.specialization || ''} 
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Email *</label>
                      <input 
                        type="email" 
                        className="form-input-modern" 
                        required 
                        value={formData.email || ''} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Phone *</label>
                      <input 
                        type="tel" 
                        className="form-input-modern" 
                        required 
                        value={formData.phone || ''} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {currentEntity === 'visit' && (
                  <>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Patient Name *</label>
                      <input 
                        className="form-input-modern" 
                        required 
                        value={formData.patientName || ''} 
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Doctor Name *</label>
                      <input 
                        className="form-input-modern" 
                        required 
                        value={formData.doctorName || ''} 
                        onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Reason *</label>
                      <textarea 
                        className="form-textarea-modern" 
                        rows="3" 
                        required 
                        value={formData.reason || ''} 
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group-modern">
                        <label className="form-label-modern">Priority *</label>
                        <select 
                          className="form-select-modern" 
                          required 
                          value={formData.priority || 'Normal'} 
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      <div className="form-group-modern">
                        <label className="form-label-modern">Status *</label>
                        <select 
                          className="form-select-modern" 
                          required 
                          value={formData.status || 'Waiting'} 
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">Time *</label>
                      <input 
                        type="time" 
                        className="form-input-modern" 
                        required 
                        value={formData.time || ''} 
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <div className="action-buttons">
                  <button type="submit" className="btn-modern btn-primary-modern">
                    {modalType === 'add' ? '➕ Add' : '💾 Save'}
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

export default AdminDashboardNew;
