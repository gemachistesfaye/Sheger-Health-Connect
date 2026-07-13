import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    // Logged in but incorrect role
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (userRole === 'patient') return <Navigate to="/patient/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
