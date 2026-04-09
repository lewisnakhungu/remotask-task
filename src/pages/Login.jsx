import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setTimeout(() => {
      // For demo — accept any credentials
      login({ name: email.split('@')[0], email, phone: '' });
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="auth-page" style={{ background: 'var(--bg)' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(147,51,234,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #9333ea, #7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
          REMOTASK
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to continue earning</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                id="login-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-submit">
            {loading ? '⏳ Signing In...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/signup">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
