import { useState, useRef } from 'react';
import { Check, Zap, Sparkles, Trophy, Crown, AlertCircle, Shield } from 'lucide-react';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';
import AlertModal from './AlertModal';

export default function PlansModal({ onClose, isGateway = false }) {
  const { plan, selectPlan, user } = useStore();
  const [step, setStep] = useState('list'); // list | payment | success
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [alertInfo, setAlertInfo] = useState(null);
  const pollingRef = useRef(false);
  const maxAttempts = 15;

  const selectedPlan = PLANS.find(p => p.id === selected);

  const getIcon = (id) => {
    switch (id) {
      case 'beginner': return <Zap size={22} />;
      case 'average': return <Sparkles size={22} />;
      case 'expert': return <Trophy size={22} />;
      case 'elite': return <Crown size={22} />;
      default: return <Zap size={22} />;
    }
  };

  const getGradient = (id) => {
    switch (id) {
      case 'beginner': return 'linear-gradient(135deg, #94a3b8, #64748b)';
      case 'average': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'expert': return 'linear-gradient(135deg, #9333ea, #7c3aed)';
      case 'elite': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, #9333ea, #7c3aed)';
    }
  };

  const handleSelect = (planId) => {
    setSelected(planId);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!phone) {
      setAlertInfo({ type: 'info', title: 'Phone Required', message: 'Please enter your M-Pesa phone number to continue.' });
      return;
    }
    if (phone.replace(/\s/g, '').length < 9) {
      setAlertInfo({ type: 'error', title: 'Invalid Number', message: 'The phone number you entered is too short. Please enter a valid Safaricom number.' });
      return;
    }

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
          customer_name: user?.name || 'Customer',
        }),
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
            setAlertInfo({
              type: 'error',
              title: 'Payment Timed Out',
              message: 'We did not receive confirmation from M-Pesa. If you entered your PIN, wait a moment and try again. Otherwise, no charge was made.',
            });
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
              setAlertInfo({
                type: 'error',
                title: 'Payment Cancelled',
                message: 'Your M-Pesa payment was cancelled or declined. Please try again and enter your PIN when prompted.',
              });
            } else {
              setTimeout(pollStatus, 7000);
            }
          } catch {
            if (pollingRef.current) setTimeout(pollStatus, 7000);
          }
        };

        setTimeout(pollStatus, 5000);
      } else {
        setLoading(false);
        setStatusText('');
        setAlertInfo({
          type: 'error',
          title: 'Payment Failed to Start',
          message: 'We could not send the M-Pesa prompt to your phone. Please check your number and try again.',
        });
      }
    } catch (err) {
      console.error('Payment Error', err);
      setLoading(false);
      setStatusText('');
      setAlertInfo({
        type: 'error',
        title: 'Connection Error',
        message: 'Something went wrong while processing your payment. Please check your internet and try again.',
      });
    }
  };

  const handleClose = () => {
    pollingRef.current = false;
    if (onClose) onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => !isGateway && e.target === e.currentTarget && handleClose()}
      style={{
        backdropFilter: 'blur(2px)',
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <div
        className="modal slide-up"
        style={{
          maxWidth: step === 'list' ? 1000 : 500,
          padding: 0,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '1.75rem',
            overflowY: 'auto',
            maxHeight: '90vh',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Step: Plan List */}
          {step === 'list' && (
            <div className="modal-pad">

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                {isGateway && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.25)', borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>
                    🔒 Activation Required to Access Tasks
                  </div>
                )}
                <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Select Your Account Tier
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 550, margin: '0 auto' }}>
                  Purchase an account tier below to instantly unlock high-paying tasks and start earning.
                </p>
              </div>

              {/* Margin adjustment for removed refund note */}
              <div style={{ marginBottom: '2rem' }}></div>

              {/* Plan cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
                {PLANS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => p.id !== plan && handleSelect(p.id)}
                    style={{
                      cursor: p.id === plan ? 'default' : 'pointer',
                      borderRadius: '1.25rem',
                      border: p.id === plan
                        ? '2px solid #22c55e'
                        : p.popular
                        ? '2px solid var(--primary)'
                        : '1px solid rgba(148,163,184,0.12)',
                      background: p.id === plan ? 'rgba(34,197,94,0.05)' : 'rgba(30,41,59,0.8)',
                      padding: '1.75rem 1.25rem',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                    onMouseOver={e => { if (p.id !== plan) e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = p.id === plan ? '#22c55e' : p.popular ? 'var(--primary)' : 'rgba(148,163,184,0.12)';
                    }}
                  >
                    {p.popular && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        ⭐ Top Pick
                      </div>
                    )}

                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: getGradient(p.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      {getIcon(p.id)}
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{p.name}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                      KES {p.price}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>account purchase</div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', padding: 0 }}>
                      {p.features.slice(0, 4).map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Check size={13} style={{ color: '#22c55e', flexShrink: 0 }} /> {f}
                        </li>
                      ))}
                    </ul>

                    {plan === p.id ? (
                      <div style={{ textAlign: 'center', color: '#22c55e', fontSize: '0.875rem', fontWeight: 700, padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        ✓ Active Plan
                      </div>
                    ) : (
                      <button className={`btn btn-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.7rem' }}>
                        Purchase — KES {p.price}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!isGateway && (
                <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                  <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Maybe later
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && selectedPlan && (
            <div className="modal-pad" style={{ maxWidth: 480, margin: '0 auto' }}>
              <button onClick={() => setStep('list')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                ← Back to plans
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>📱 M-Pesa Payment</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>Complete your account purchase securely via M-Pesa.</p>

              {/* Plan summary */}
              <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(148,163,184,0.12)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{selectedPlan.name} Activation</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)' }}>KES {selectedPlan.price}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Account upgrade purchase</div>
              </div>

              {/* Removed refund reminder */}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>M-Pesa Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '0.6rem', overflow: 'hidden', background: 'var(--surface2)' }}>
                  <span style={{ padding: '0 0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderRight: '1px solid var(--border)', height: '100%', display: 'flex', alignItems: 'center', minHeight: 48 }}>🇰🇪 +254</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="712 345 678"
                    disabled={loading}
                    style={{ flex: 1, padding: '0.85rem', border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handlePayment}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading && <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                {loading ? (statusText || 'Processing...') : `Pay KES ${selectedPlan.price} via M-Pesa`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                <AlertCircle size={13} color="var(--text-dim)" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Secured via PayHero. Do not share your M-Pesa PIN with anyone.</span>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="modal-pad" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Account Activated!</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Welcome to AIPesa. Your <strong>{selectedPlan?.name}</strong> account is now active. You can start completing tasks and earning real M-Pesa rewards.
              </p>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleClose}>
                Start Earning Now →
              </button>
            </div>
          )}
        </div>
      </div>

      {alertInfo && (
        <AlertModal
          type={alertInfo.type}
          title={alertInfo.title}
          message={alertInfo.message}
          onClose={() => setAlertInfo(null)}
        />
      )}
    </div>
  );
}
