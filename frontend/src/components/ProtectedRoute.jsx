import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col justify-center items-center">
        <div className="status-pulse mb-4"></div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Authenticating Session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the original destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their proper dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'brand') return <Navigate to="/brand" replace />;
    if (user.role === 'hospital') return <Navigate to="/hospital" replace />;
    
    // Default fallback
    return <Navigate to="/" replace />;
  }

  return children;
};
