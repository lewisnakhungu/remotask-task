import { useState, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';

export default function UpgradeModal({ onClose }) {
  const { plan, selectPlan, user } = useStore();
  const [selected, setSelected] = useState(plan || 'average');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // select | payment | success
  
  const [phone, setPhone] = useState(user?.phone || '');
  const [statusText, setStatusText] = useState('');
  const maxAttempts = 15;
  const pollingRef = useRef(false);

  const selectedPlan = PLANS.find(p => p.id === selected);

  const handleUpgrade = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!phone) return alert('Please enter your M-Pesa phone number.');
    if (phone.replace(/\s/g, '').length < 10) return alert('Invalid phone number.');

    setLoading(true);
    setStatusText('Initiating payment...');
    pollingRef.current = true;

    try {
      const pushRes = await fetch('/api/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: selectedPlan.price, 
          phone_number: phone,
          customer_name: user?.name || "Customer",
        })
      });
      const pushData = await pushRes.json();

      if (pushData.status?.toUpperCase() === 'SUCCESS' || pushData.status === 'QUEUED' || pushData.success === true) {
        const reference = pushData.reference;
        setStatusText('Check your phone and enter M-Pesa PIN...');
        let attemptCount = 0;
        
        const pollStatus = async () => {
          if (!pollingRef.current) return;

          attemptCount++;
          if (attemptCount > maxAttempts) {
            setLoading(false);
            setStatusText('');
            alert('Payment confirmation timed out. Please try again.');
            return;
          }

          try {
            const statusRes = await fetch(`/api/payment-status?reference=${reference}`);
            const statusData = await statusRes.json();

            if (!pollingRef.current) return;

            if (statusData.status === 'success') {
              selectPlan(selected);
              setLoading(false);
              setStep('success');
            } else if (statusData.status === 'failed') {
              setLoading(false);
              setStatusText('');
              alert('Payment failed or was cancelled.');
            } else {
              setTimeout(pollStatus, 7000);
            }
          } catch (e) {
            if (pollingRef.current) setTimeout(pollStatus, 7000);
          }
        };

        setTimeout(pollStatus, 5000);
      } else {
        setLoading(false);
        setStatusText('');
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment Error', err);
      setLoading(false);
      setStatusText('');
      alert('An error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    pollingRef.current = false;
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
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
              <button className="modal-close" onClick={handleClose}><X size={20} /></button>
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
              <button className="modal-close" onClick={handleClose}><X size={20} /></button>
            </div>

            <div style={{ background: 'var(--surface2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Plan</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedPlan?.name}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>KES {selectedPlan?.price}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly subscription</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>M-Pesa Phone Number</label>
              <input 
                type="tel" 
                className="input" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="e.g. 0712345678" 
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', outline: 'none' }}
              />
            </div>

            <button className="btn btn-success btn-full btn-lg" onClick={handlePayment} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <span className="spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} /> : null}
              {loading ? (statusText || 'Processing...') : `Pay KES ${selectedPlan?.price}`}
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
            <button className="btn btn-primary btn-full" onClick={handleClose}>
              Start Earning →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
