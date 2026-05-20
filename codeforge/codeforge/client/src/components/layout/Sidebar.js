import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  {
    id: 'editor',
    label: 'Code Editor',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? '72px' : '240px' }}>
      {/* Logo */}
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M4 14L14 4L24 14L14 24L4 14Z" fill="url(#slg)" stroke="#7c3aed" strokeWidth="1.5"/>
            <path d="M10 14L14 10L18 14L14 18L10 14Z" fill="#a78bfa"/>
            <defs>
              <linearGradient id="slg" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed"/>
                <stop offset="1" stopColor="#2563eb"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        {!collapsed && <span style={styles.logoText}>CodeForge</span>}
        <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed
              ? <polyline points="9 18 15 12 9 6"/>
              : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.navItem,
              ...(activeTab === item.id ? styles.navItemActive : {}),
            }}
            title={collapsed ? item.label : ''}
          >
            <span style={{ color: activeTab === item.id ? '#a78bfa' : '#6b7280' }}>
              {item.icon}
            </span>
            {!collapsed && (
              <span style={activeTab === item.id ? styles.navLabelActive : styles.navLabel}>
                {item.label}
              </span>
            )}
            {activeTab === item.id && <span style={styles.activeDot} />}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={styles.userArea}>
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.username}</span>
              <span style={styles.userRole}>Developer</span>
            </div>
          )}
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span style={{ fontSize: '13px', marginLeft: '4px' }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    background: 'rgba(10, 10, 18, 0.95)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 20,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    gap: '10px',
    minHeight: '72px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(124,58,237,0.12)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  collapseBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    padding: '16px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    position: 'relative',
    transition: 'background 0.15s',
  },
  navItemActive: {
    background: 'rgba(124,58,237,0.12)',
  },
  navLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },
  navLabelActive: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e5e7eb',
    whiteSpace: 'nowrap',
  },
  activeDot: {
    position: 'absolute',
    right: '10px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#7c3aed',
  },
  userArea: {
    padding: '12px 10px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e5e7eb',
    textTransform: 'capitalize',
  },
  userRole: {
    fontSize: '11px',
    color: '#6b7280',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: '8px',
    color: '#f87171',
    cursor: 'pointer',
    padding: '8px 12px',
    fontSize: '13px',
    transition: 'background 0.15s',
    width: '100%',
  },
};

export default Sidebar;
