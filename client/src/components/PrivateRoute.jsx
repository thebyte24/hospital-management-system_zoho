import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
