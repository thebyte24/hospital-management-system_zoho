import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/Auth.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user just signed up
  useEffect(() => {
    if (location.state?.signupSuccess) {
      // Auto-login the user who just signed up
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
        navigate('/patient');
      }
    }
  }, [location, setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement Catalyst Authentication
      // For now, mock authentication for development
      
      // Mock user data
      const mockUser = {
        id: '123',
        name: email.split('@')[0],
        email: email,
        role: email.includes('doctor') ? 'Doctor' : 
              email.includes('admin') ? 'Admin' : 
              'Patient'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Navigate based on role
      if (mockUser.role === 'Doctor') {
        navigate('/doctor');
      } else if (mockUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/patient');
      }
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
        
        <div className="info-message" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
          <strong>Local Development Mode</strong><br />
          Use these test accounts:<br />
          • patient@test.com - Patient Dashboard<br />
          • doctor@test.com - Doctor Dashboard<br />
          • admin@test.com - Admin Dashboard<br />
          <em style={{ fontSize: '0.75rem' }}>Password: any</em>
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
          <p className="text-muted">
            Doctor and Admin accounts are created by administrators
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
