import { useState, useRef } from 'react';
import { X, Lock } from 'lucide-react';
import useStore from '../store/useStore';

export default function UnlockTaskModal({ task, onClose }) {
  const { user, unlockTask } = useStore();
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [step, setStep] = useState('payment'); // payment | success
  
  const pollingRef = useRef(false);
  const maxAttempts = 15;

  const handlePayment = async () => {
    if (!phone) return alert('Please enter your M-Pesa phone number.');
    if (phone.replace(/\s/g, '').length < 9) return alert('Invalid phone number.');

    setLoading(true);
    setStatusText('Initiating payment...');
    pollingRef.current = true;

    try {
      const pushRes = await fetch('/api/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: task.unlockFee, 
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
              unlockTask(task.id);
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
      <div className="modal slide-up" style={{ maxWidth: 450 }}>
        {step === 'payment' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} color="var(--primary)" /> Unlock Premium Task
              </h2>
              <button className="modal-close" onClick={handleClose}><X size={20} /></button>
            </div>

            <div style={{ background: 'var(--surface2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Task</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{task.title}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>KES {task.unlockFee}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>M-Pesa Activation Fee</div>
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
                style={{ width: '100%', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              />
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handlePayment} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <span className="spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} /> : null}
              {loading ? (statusText || 'Processing...') : `Pay KES ${task.unlockFee}`}
            </button>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔓</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Task Unlocked!</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              You can now access "{task.title}". Complete it to earn KES {task.reward}.
            </p>
            <button className="btn btn-primary btn-full" onClick={handleClose}>
              Continue to Task →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
