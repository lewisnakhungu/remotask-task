import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListTodo, DollarSign, Crown, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';

export default function Navbar() {
  const { user, balance, logout } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { to: '/tasks', label: 'Tasks', icon: <ListTodo size={15} /> },
    { to: '/earnings', label: 'Earnings', icon: <DollarSign size={15} /> },
    { to: '/plans', label: 'Plans', icon: <Crown size={15} /> },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="brand-icon">⚡</div>
            <span>AIPESA</span>
          </div>

          <div className="navbar-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions">
            <div className="balance-chip">
              KES {balance.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ gap: '0.4rem' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
          <button className="mobile-nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
