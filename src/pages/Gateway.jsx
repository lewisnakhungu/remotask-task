import { Link } from 'react-router-dom';

export default function Gateway() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Formal Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, fontSize: '1.1rem' }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #475569, #334155)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>A</div>
            AIPESA PLATFORM
          </div>
        </div>
      </header>

      {/* Hero Section (Bland/Compliant) */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Data Labeling Solutions for<br />
            Next-Generation AI
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 3rem' }}>
            AIPesa provides a reliable crowdsourcing environment for complex data annotation, transcription, and categorization. Join our global independent contractor pool to contribute to cutting-edge artificial intelligence development. Work on your own schedule from anywhere.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }}>
              View Opportunities
            </Link>
            <Link to="/terms" className="btn btn-secondary btn-lg" style={{ padding: '1rem 3rem' }}>
              Read Terms
            </Link>
          </div>
        </div>
      </section>

      {/* Formal Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', background: 'var(--surface2)', color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
          <div>Location: Victoria Towers, Upper Hill, Nairobi, Kenya</div>
          <div>Contact: compliance@aipesa.co.ke | +254 20 123 4567</div>
          <div style={{ marginTop: '0.5rem' }}>© 2026 AIPesa Data Solutions. Registration No: PVT-AI2026</div>
        </div>
      </footer>
    </div>
  );
}
