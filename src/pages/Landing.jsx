import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LiveTicker from '../components/LiveTicker';

export default function Landing() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const features = [
    { icon: '🤖', title: 'Easy AI Tasks', desc: 'Simple surveys and labeling tasks anyone can complete — no special skills needed.' },
    { icon: '📱', title: 'Instant M-Pesa', desc: 'Withdraw directly to your M-Pesa. Payments processed within minutes.' },
    { icon: '🌍', title: 'Work Anywhere', desc: 'Complete tasks anytime, anywhere on your phone or computer.' },
    { icon: '💰', title: 'Real Earnings', desc: 'Earn KES 150–300+ per hour completing tasks for global AI companies.' },
    { icon: '🔒', title: 'Secure Platform', desc: 'Your data is encrypted and payments are fully secured.' },
    { icon: '⚡', title: 'Daily Payouts', desc: 'Request withdrawals every day with no minimum waiting period.' },
  ];

  const stats = [
    { value: '47,000+', label: 'Active Workers' },
    { value: 'KES 12M+', label: 'Total Paid Out' },
    { value: '4.8/5', label: 'User Rating' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, fontSize: '1.1rem' }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #9333ea, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
            AIPESA
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      <LiveTicker />

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-glow" />

        <div className="hero-badge">
          🎁 New members get <strong>&nbsp;KES 600&nbsp;</strong> welcome bonus
        </div>

        <h1 className="hero-title">
          Earn Money by<br />
          <span className="gradient-text">Training AI</span>
        </h1>

        <p className="hero-sub">
          Join 47,000+ Kenyan workers completing AI tasks and earning real money — paid directly to your M-Pesa.
        </p>

        <div className="hero-bonus">
          <span>🎁</span>
          Sign up today and get <strong>KES 600 Welcome Bonus</strong> instantly credited
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '2rem 3rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <label className="terms-check">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms-checkbox" />
          <span>I agree to the <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>. I understand this is a real earning platform.</span>
        </label>

        <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => agreed && navigate('/signup')}
            disabled={!agreed}
            id="create-account-btn"
          >
            🚀 Create Free Account
          </button>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(30,41,59,0.3)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Why Choose AIPESA?</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Everything you need to start earning today</p>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Start earning in 3 simple steps</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up for free and complete a quick skill assessment to verify your profile.' },
              { step: '02', title: 'Complete AI Tasks', desc: 'Browse available tasks — surveys, data labeling, sentiment analysis, and more.' },
              { step: '03', title: 'Withdraw Your Earnings', desc: 'Request instant M-Pesa payment. No delays, no hidden fees.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary-light)', border: '2px solid rgba(147,51,234,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(147,51,234,0.1), rgba(99,102,241,0.05))' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to Start Earning?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join thousands of Kenyans already making money with AIPESA</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            🚀 Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Link to="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms</Link>
            <span style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>compliance@aipesa.co.ke</span>
        </div>
        <p>© 2026 AIPESA. All rights reserved. | Nairobi, Kenya | PVT-AI2026</p>
      </footer>
    </div>
  );
}
