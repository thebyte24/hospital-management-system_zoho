import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock authentication - works without backend
      const mockUser = {
        id: Date.now().toString(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        role: email.includes('doctor') ? 'Doctor' : 
              email.includes('admin') ? 'Admin' : 
              'Patient'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Navigate based on role
      setTimeout(() => {
        if (mockUser.role === 'Doctor') {
          navigate('/doctor');
        } else if (mockUser.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/patient');
        }
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Hospital Queue Management</h1>
        <h2 className="auth-subtitle">Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="info-message" style={{ 
          fontSize: '0.875rem', 
          marginBottom: 'var(--spacing-md)', 
          backgroundColor: '#e3f2fd', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <strong>🎯 Demo Mode - Use These Test Accounts:</strong><br />
          <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            👤 <strong>patient@hospital.com</strong> - Patient Dashboard<br />
            👨‍⚕️ <strong>doctor@hospital.com</strong> - Doctor Dashboard<br />
            👔 <strong>admin@hospital.com</strong> - Admin Dashboard<br />
          </div>
          <em style={{ fontSize: '0.75rem', display: 'block', marginTop: '0.5rem', color: '#555' }}>
            Password: any (demo mode - all dashboards have mock data)
          </em>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            New patient? <Link to="/signup">Sign up here</Link>
          </p>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Demo Version - All dashboards work with mock data
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
