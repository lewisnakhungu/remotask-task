import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';

export default function Signup() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = 'Enter your full name (min 3 chars)';
    if (!form.phone || form.phone.length < 9) e.phone = 'Enter a valid Kenyan phone number';
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      register({ name: form.name, phone: form.phone, email: form.email });
      setLoading(false);
      navigate('/assessment');
    }, 1000);
  };

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => { const n = { ...er }; delete n[field]; return n; });
  };

  return (
    <div className="auth-page" style={{ background: 'var(--bg)' }}>
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(147,51,234,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #9333ea, #7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
          AIPESA
        </div>

        <div style={{ background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '0.9rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🎁</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>KES 600 Welcome Bonus</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instantly credited after account verification</div>
          </div>
        </div>

        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-sub">Start earning in under 5 minutes</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="John Kamau"
              id="signup-name"
            />
            {errors.name && <span style={{ fontSize: '0.76rem', color: 'var(--danger)' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="form-input-group">
              <span className="prefix">🇰🇪 +254</span>
              <input
                className="form-input"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="712 345 678"
                id="signup-phone"
              />
            </div>
            {errors.phone && <span style={{ fontSize: '0.76rem', color: 'var(--danger)' }}>{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="john@example.com"
              id="signup-email"
            />
            {errors.email && <span style={{ fontSize: '0.76rem', color: 'var(--danger)' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="Min 6 characters"
                id="signup-password"
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
            {errors.password && <span style={{ fontSize: '0.76rem', color: 'var(--danger)' }}>{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="signup-submit" style={{ marginTop: '0.5rem' }}>
            {loading ? '⏳ Creating Account...' : '🚀 Create Free Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
