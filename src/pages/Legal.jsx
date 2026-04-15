import { useLocation, Link } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Formal Navbar */}
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>AIPESA</div>
          <Link to="/welcome" className="btn btn-ghost btn-sm">Return</Link>
        </div>
      </header>

      <div className="container" style={{ maxWidth: 800, padding: '4rem 1.5rem', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        
        <div style={{ color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1.5rem' }}><strong>Last Updated: January 1, 2026</strong></p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            Welcome to AIPesa Data Solutions ("Company", "we", "our", "us"). These {isPrivacy ? 'Privacy Policies' : 'Terms of Service'} govern your use of our platform located at aipesa.co.ke and our mobile applications.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            By accessing and utilizing our platform, you accept and agree to be bound by the terms and provisions of this agreement. Our platform facilitates connections between crowdsourced independent contractors and data processing tasks.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>2. {isPrivacy ? 'Data Collection & Usage' : 'User Obligations'}</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            {isPrivacy ? 
              'We collect information necessary to facilitate secure payments, verify identity, and ensure quality control of labeled data. This includes basic profile information and payment routing details. We do not sell your personal data to third parties.' : 
              'Users must be 18 years of age or older. You agree to provide accurate information during registration and maintain the confidentiality of your account credentials. You understand you act as an independent contractor.'}
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>3. Contact Information</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            If you have any questions regarding these terms or policies, please contact our compliance team:
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Email: compliance@aipesa.co.ke</li>
            <li>Address: Victoria Towers, Upper Hill, Nairobi, Kenya</li>
            <li>Registration: PVT-RTX2026</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
