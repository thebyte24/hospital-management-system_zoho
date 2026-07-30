import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    // TODO: Check if user is authenticated via Catalyst SDK
    // For now, check localStorage for demo purposes
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute user={user} />}>
          <Route element={<Layout user={user} setUser={setUser} />}>
            <Route 
              path="/patient" 
              element={<PatientDashboard user={user} />} 
            />
            <Route 
              path="/doctor" 
              element={<DoctorDashboard user={user} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboard user={user} />} 
            />
          </Route>
        </Route>

        {/* Default redirects */}
        <Route path="/" element={
          user ? (
            user.role === 'Patient' ? <Navigate to="/patient" /> :
            user.role === 'Doctor' ? <Navigate to="/doctor" /> :
            user.role === 'Admin' ? <Navigate to="/admin" /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
