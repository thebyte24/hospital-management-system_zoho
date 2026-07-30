import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

function Layout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement Catalyst logout
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Hospital Queue Management</h1>
            {user && (
              <span className="user-role-badge">
                {user.role}
              </span>
            )}
          </div>
          <div className="header-right">
            {user && (
              <>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <footer className="footer">
        <p>&copy; 2026 Hospital Queue Management System</p>
      </footer>
    </div>
  );
}

export default Layout;
