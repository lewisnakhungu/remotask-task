import { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

export default function WithdrawModal({ onClose, onNeedUpgrade }) {
  const { balance, plan, withdraw, user } = useStore();
  const [step, setStep] = useState('method'); // method | form | confirm | success
  const [method, setMethod] = useState('mpesa');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const minWithdraw = 500;

  const handleMethodSelect = (m) => {
    if (m !== 'mpesa') return;
    setMethod(m);
  };

  const handleContinue = () => {
    if (!plan) {
      onClose();
      onNeedUpgrade();
      return;
    }
    setStep('form');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amount);
    if (!phone || phone.length < 9) { setError('Enter a valid M-Pesa number'); return; }
    if (!amount || isNaN(amt)) { setError('Enter a valid amount'); return; }
    if (amt < minWithdraw) { setError(`Minimum withdrawal is KES ${minWithdraw}`); return; }
    if (amt > balance) { setError('Insufficient balance'); return; }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      withdraw(parseFloat(amount), phone);
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  const methods = [
    { id: 'mpesa', label: 'M-Pesa', icon: '📱', available: true },
    { id: 'paypal', label: 'PayPal', icon: '💳', available: false },
    { id: 'bank', label: 'Bank', icon: '🏦', available: false },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal slide-up">
        {step === 'method' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">💰 Withdraw Earnings</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Available Balance</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>KES {balance.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>Select Withdrawal Method</div>
            <div className="withdraw-method-grid">
              {methods.map(m => (
                <div
                  key={m.id}
                  className={`withdraw-method ${method === m.id ? 'active' : ''} ${!m.available ? 'disabled' : ''}`}
                  onClick={() => m.available && handleMethodSelect(m.id)}
                >
                  {!m.available && <span className="coming-soon-tag">Soon</span>}
                  <div className="method-icon">{m.icon}</div>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
            {!plan && (
              <div style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⚠️ You need an active plan to withdraw. Upgrade your account to continue.
              </div>
            )}
            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.5rem' }} onClick={handleContinue}>
              {plan ? 'Continue to Withdrawal →' : 'Upgrade to Withdraw →'}
            </button>
          </>
        )}

        {step === 'form' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">📱 M-Pesa Withdrawal</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">M-Pesa Phone Number</label>
                <div className="form-input-group">
                  <span className="prefix">+254</span>
                  <input className="form-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="7XX XXX XXX" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (KES)</label>
                <input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Min KES ${minWithdraw}`} min={minWithdraw} max={balance} required />
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Available: KES {balance.toLocaleString()} • Min: KES {minWithdraw}</span>
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>⚠️ {error}</p>}
              <button type="submit" className="btn btn-success btn-full btn-lg">
                Review Withdrawal →
              </button>
            </form>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Withdrawal</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Recipient</span>
                <span style={{ fontWeight: 600 }}>{name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Phone</span>
                <span style={{ fontWeight: 600 }}>+254 {phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Amount</span>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--success)' }}>KES {parseFloat(amount).toLocaleString()}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Funds will be sent to your M-Pesa within 1-5 minutes
            </p>
            <button className="btn btn-success btn-full btn-lg" onClick={handleConfirm} disabled={loading}>
              {loading ? '⏳ Processing...' : '✓ Confirm Withdrawal'}
            </button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: '0.75rem' }} onClick={() => setStep('form')}>
              ← Edit Details
            </button>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Withdrawal Initiated!</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              KES {parseFloat(amount).toLocaleString()} has been sent to +254 {phone}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>
              You will receive an M-Pesa confirmation SMS shortly
            </p>
            <button className="btn btn-primary btn-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
