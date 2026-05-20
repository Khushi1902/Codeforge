import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.logoMark}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M4 14L14 4L24 14L14 24L4 14Z" fill="url(#plg)" stroke="#7c3aed" strokeWidth="1.5"/>
            <path d="M10 14L14 10L18 14L14 18L10 14Z" fill="#a78bfa"/>
            <defs>
              <linearGradient id="plg" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed"/>
                <stop offset="1" stopColor="#2563eb"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const styles = {
  loader: {
    minHeight: '100vh',
    background: '#050508',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
  },
  logoMark: {
    width: '64px',
    height: '64px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(124,58,237,0.2)',
    borderTopColor: '#7c3aed',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

export default ProtectedRoute;
