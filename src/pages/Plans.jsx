import { useState } from 'react';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';

export default function Plans() {
  const { plan, selectPlan } = useStore();
  const [paying, setPaying] = useState(null);
  const [step, setStep] = useState('list'); // list | payment | success
  const [selected, setSelected] = useState(null);

  const handleSelect = (planId) => {
    setSelected(planId);
    setStep('payment');
  };

  const handlePayment = () => {
    setPaying(selected);
    setTimeout(() => {
      selectPlan(selected);
      setPaying(null);
      setStep('success');
    }, 2000);
  };

  const selectedPlan = PLANS.find(p => p.id === selected);

  if (step === 'payment' && selectedPlan) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="main-content">
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => setStep('list')}>
              ← Back to Plans
            </button>
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>📱 M-Pesa Payment</h2>
              <div style={{ background: 'var(--surface2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{selectedPlan.name} Plan</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>KES {selectedPlan.price}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>per month • {selectedPlan.tasksPerDay} tasks/day</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success)' }}>M-Pesa Payment Instructions</div>
                <ol style={{ listStyle: 'decimal', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <li>Open M-Pesa on your phone</li>
                  <li>Go to <strong style={{ color: 'var(--text)' }}>Lipa na M-Pesa → Pay Bill</strong></li>
                  <li>Business No: <strong style={{ color: 'var(--text)' }}>247247</strong></li>
                  <li>Account No: <strong style={{ color: 'var(--text)' }}>Your Phone Number</strong></li>
                  <li>Amount: <strong style={{ color: 'var(--success)' }}>KES {selectedPlan.price}</strong></li>
                  <li>Enter PIN and confirm</li>
                </ol>
              </div>
              <button className="btn btn-success btn-full btn-lg" onClick={handlePayment} disabled={!!paying} id="confirm-payment-btn">
                {paying ? '⏳ Verifying Payment...' : '✓ I Have Sent Payment'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1rem' }}>
                Your account will be activated instantly upon payment verification
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="main-content">
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Plan Activated!</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your {selectedPlan?.name} plan is now active. You can complete up to {selectedPlan?.tasksPerDay} tasks per day.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => { setStep('list'); }}>
              Start Earning →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Choose Your Plan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Unlock more tasks and maximize your daily earnings
          </p>
          {plan && (
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
              ✓ Current: {PLANS.find(p2 => p2.id === plan)?.name} Plan
            </div>
          )}
        </div>

        <div className="plans-grid" style={{ maxWidth: 1000, margin: '0 auto 3rem' }}>
          {PLANS.map(p => (
            <div key={p.id} className={`plan-card ${p.popular ? 'popular' : ''}`}>
              {p.popular && <div className="plan-popular-badge">Most Popular</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                KES {p.price} <span>/month</span>
              </div>
              <div className="plan-tasks">Up to {p.tasksPerDay} tasks/day</div>
              <ul className="plan-features">
                {p.features.map(f => (
                  <li key={f} className="plan-feature">
                    <Check size={14} className="check" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan === p.id ? (
                <div className="btn btn-sm btn-full" style={{ background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--success)', cursor: 'default' }}>
                  ✓ Current Plan
                </div>
              ) : (
                <button
                  className={`btn btn-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSelect(p.id)}
                  id={`select-plan-${p.id}`}
                >
                  Get {p.name} Plan →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.' },
            { q: 'How do I pay?', a: 'We accept M-Pesa payments. Simply follow the paybill instructions shown during checkout.' },
            { q: 'When can I start earning after upgrading?', a: 'Your account is activated instantly after payment verification — usually within 1-2 minutes.' },
            { q: 'What happens when I reach my daily task limit?', a: 'Tasks will be locked until the next day. Upgrade to a higher plan for more daily tasks.' },
          ].map(faq => (
            <div key={faq.q} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>❓ {faq.q}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
