import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';

export default function UpgradeModal({ onClose }) {
  const { plan, selectPlan } = useStore();
  const [selected, setSelected] = useState(plan || 'average');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // select | payment | success

  const selectedPlan = PLANS.find(p => p.id === selected);

  const handleUpgrade = () => {
    setStep('payment');
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      selectPlan(selected);
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal slide-up" style={{ maxWidth: 520 }}>
        {step === 'select' && (
          <>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">🚀 Upgrade Your Account</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Unlock more tasks and higher earnings
                </p>
              </div>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>

            <div style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Free accounts are limited to 3 tasks/day. Upgrade to unlock unlimited earnings and instant M-Pesa withdrawals.
              </p>
            </div>

            <div className="upgrade-modal-plans">
              {PLANS.map(p => (
                <div
                  key={p.id}
                  className={`upgrade-plan-row ${selected === p.id ? 'selected' : ''}`}
                  onClick={() => setSelected(p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="upgrade-plan-name">{p.name}</div>
                    <div className="upgrade-plan-meta">{p.tasksPerDay} tasks/day</div>
                  </div>
                  {p.popular && <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '2rem', fontWeight: 700 }}>POPULAR</span>}
                  <div className="upgrade-plan-price">KES {p.price}/mo</div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.5rem' }} onClick={handleUpgrade}>
              Continue with {selectedPlan?.name} — KES {selectedPlan?.price}/mo
            </button>
          </>
        )}

        {step === 'payment' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">📱 M-Pesa Payment</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>

            <div style={{ background: 'var(--surface2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Plan</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedPlan?.name}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>KES {selectedPlan?.price}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly subscription</div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--success)' }}>Paybill:</strong> 247247<br />
                <strong style={{ color: 'var(--success)' }}>Account No:</strong> Your Phone Number<br />
                <strong style={{ color: 'var(--success)' }}>Amount:</strong> KES {selectedPlan?.price}
              </p>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Send the payment then click confirm below
            </p>

            <button className="btn btn-success btn-full btn-lg" onClick={handlePayment} disabled={loading}>
              {loading ? <span className="spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} /> : null}
              {loading ? 'Verifying Payment...' : '✓ I Have Sent Payment'}
            </button>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Upgraded!</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              You now have access to {selectedPlan?.tasksPerDay} tasks/day.
            </p>
            <button className="btn btn-primary btn-full" onClick={onClose}>
              Start Earning →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
