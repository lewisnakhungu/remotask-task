import { useState } from 'react';
import { X, Check, Zap, Sparkles, Trophy, Crown } from 'lucide-react';
import useStore from '../store/useStore';
import { PLANS } from '../store/useStore';

export default function PlansModal({ onClose }) {
  const { plan, selectPlan } = useStore();
  const [step, setStep] = useState('list'); // list | payment | success
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (planId) => {
    setSelected(planId);
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

  const selectedPlan = PLANS.find(p => p.id === selected);

  const getIcon = (id) => {
    switch (id) {
      case 'beginner': return <Zap size={20} />;
      case 'average': return <Sparkles size={20} />;
      case 'expert': return <Trophy size={20} />;
      case 'elite': return <Crown size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const getGradient = (id) => {
    switch (id) {
      case 'beginner': return 'linear-gradient(135deg, #94a3b8, #64748b)';
      case 'average': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'expert': return 'linear-gradient(135deg, #9333ea, #7c3aed)';
      case 'elite': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, var(--primary), #7c3aed)';
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal slide-up" style={{ maxWidth: step === 'list' ? 980 : 480, padding: 0, overflow: 'hidden', background: 'transparent', border: 'none' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
          >
            <X size={18} />
          </button>

          {step === 'list' && (
            <div style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Upgrade Your Potential
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                  Select a plan that fits your earning goals
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
                {PLANS.map(p => (
                  <div 
                    key={p.id} 
                    className={`plan-card ${p.popular ? 'popular' : ''}`}
                    style={{ 
                      cursor: 'pointer',
                      borderWidth: p.id === plan ? '2px' : '1px',
                      borderColor: p.id === plan ? 'var(--success)' : p.popular ? 'var(--primary)' : 'var(--border)',
                      background: p.id === plan ? 'rgba(34, 197, 94, 0.05)' : 'var(--surface2)',
                      padding: '1.75rem 1.25rem'
                    }}
                    onClick={() => p.id !== plan && handleSelect(p.id)}
                  >
                    {p.popular && <div className="plan-popular-badge">Top Pick</div>}
                    
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: getGradient(p.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                      {getIcon(p.id)}
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{p.name}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>
                      KES {p.price} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-dim)' }}>/mo</span>
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: 0 }}>
                      {p.features.slice(0, 4).map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {plan === p.id ? (
                      <div style={{ textAlign: 'center', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 700, padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        ✓ Active Plan
                      </div>
                    ) : (
                      <button 
                        className={`btn btn-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.75rem' }}
                      >
                        Choose Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'payment' && selectedPlan && (
            <div style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>📱 Complete Payment</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Follow the M-Pesa instructions below</p>
              </div>

              <div style={{ background: 'var(--surface2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{selectedPlan.name} Plan</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>KES {selectedPlan.price}</div>
              </div>

              <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--success)' }}>M-Pesa Paybill</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Business No:</span> <strong>247247</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account No:</span> <strong>Your Phone</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Amount:</span> <strong>KES {selectedPlan.price}</strong></div>
                </div>
              </div>

              <button className="btn btn-success btn-full btn-lg" onClick={handlePayment} disabled={loading}>
                {loading ? '⏳ Verifying...' : '✓ I Have Paid'}
              </button>
              
              <button className="btn btn-ghost btn-full" style={{ marginTop: '0.75rem', border: 'none' }} onClick={() => setStep('list')}>
                ← Back to plans
              </button>
            </div>
          )}

          {step === 'success' && (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>Upgrade Successful!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Your account has been upgraded to the <strong>{selectedPlan?.name}</strong> plan. You can now start earning more today.
              </p>
              <button className="btn btn-primary btn-full btn-lg" onClick={onClose}>
                Start Earning Now →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
