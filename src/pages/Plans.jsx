import { useState } from 'react';
import { Check, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlansModal from '../components/PlansModal';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';

export default function Plans() {
  const { plan } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedForModal, setSelectedForModal] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (planId) => {
    setSelectedForModal(planId);
    setShowModal(true);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Activation Tiers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Select a commitment tier to unlock tasks and start earning via M-Pesa.
          </p>
          {plan && (
            <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>
              ✓ Active: {PLANS.find(p2 => p2.id === plan)?.name} Tier
            </div>
          )}
        </div>

        {/* Refund note */}
        <div style={{ maxWidth: 700, margin: '0 auto 2.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '1rem', padding: '1rem 1.25rem' }}>
          <Shield size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.25rem' }}>Commitment Fee — 100% Refundable</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              The activation fee is a quality assurance commitment deposit, not a subscription charge. It confirms your dedication as a verified AIPesa contributor. You may request a full refund at any time by contacting <strong>compliance@aipesa.co.ke</strong>.
            </p>
          </div>
        </div>

        {/* Plans grid */}
        <div className="plans-grid" style={{ maxWidth: 1000, margin: '0 auto 3rem' }}>
          {PLANS.map(p => (
            <div key={p.id} className={`plan-card ${p.popular ? 'popular' : ''}`}>
              {p.popular && <div className="plan-popular-badge">⭐ Top Pick</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                KES {p.price} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>one-time fee</span>
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
                <div className="btn btn-sm btn-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', cursor: 'default' }}>
                  ✓ Active Tier
                </div>
              ) : (
                <button
                  className={`btn btn-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSelect(p.id)}
                  id={`select-plan-${p.id}`}
                >
                  Purchase {p.name} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
          {[
            { q: 'Is the fee really refundable?', a: 'Yes. The commitment fee is a quality assurance deposit, not a charge. Email compliance@aipesa.co.ke at any time to initiate a full refund.' },
            { q: 'How do I pay?', a: 'We use an automated M-Pesa STK Push. Enter your phone number and you will receive an M-Pesa prompt to approve on your phone.' },
            { q: 'When can I start earning after activating?', a: 'Your account is unlocked instantly after M-Pesa payment confirmation — usually within 30 seconds.' },
            { q: 'What happens when I reach my daily task limit?', a: 'Tasks will be paused until the next day. Higher tiers give you more tasks per day.' },
          ].map(faq => (
            <div key={faq.q} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>❓ {faq.q}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

      </div>

      {showModal && (
        <PlansModal
          onClose={() => { setShowModal(false); if (plan) navigate('/tasks'); }}
        />
      )}
    </div>
  );
}
