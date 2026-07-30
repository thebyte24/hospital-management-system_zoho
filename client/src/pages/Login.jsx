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

  // Pre-fill email if coming from signup
  useEffect(() => {
    if (location.state?.signupSuccess && location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://hospital-queue-api-50044499616.development.catalystappsail.in'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data
      const user = {
        id: data.data.userId,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role.charAt(0).toUpperCase() + data.data.role.slice(1) // Capitalize role
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Navigate based on role
      if (user.role === 'Doctor') {
        navigate('/doctor');
      } else if (user.role === 'Admin') {
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
        
        {location.state?.signupSuccess && (
          <div className="success-message" style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            border: '1px solid #c3e6cb'
          }}>
            Signup successful! Please login with your credentials.
          </div>
        )}
        
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
