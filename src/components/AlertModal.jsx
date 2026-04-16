import { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * Reusable modal for success / error / info messages.
 * Props:
 *  - type: 'error' | 'success' | 'info'
 *  - title: string
 *  - message: string
 *  - onClose: () => void
 *  - actionLabel: string (optional, defaults to "OK")
 *  - onAction: () => void (optional, defaults to onClose)
 */
export default function AlertModal({ type = 'error', title, message, onClose, actionLabel = 'OK', onAction }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const config = {
    error: {
      icon: <AlertTriangle size={32} />,
      iconBg: 'rgba(239,68,68,0.12)',
      iconColor: '#ef4444',
      btnClass: 'btn-danger',
      borderColor: 'rgba(239,68,68,0.25)',
      titleColor: '#ef4444',
    },
    success: {
      icon: <CheckCircle size={32} />,
      iconBg: 'rgba(34,197,94,0.12)',
      iconColor: '#22c55e',
      btnClass: 'btn-success',
      borderColor: 'rgba(34,197,94,0.25)',
      titleColor: '#22c55e',
    },
    info: {
      icon: <Info size={32} />,
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: '#6366f1',
      btnClass: 'btn-primary',
      borderColor: 'rgba(99,102,241,0.25)',
      titleColor: '#a5b4fc',
    },
  };

  const c = config[type] || config.error;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="slide-up"
        style={{
          background: 'rgba(15,23,42,0.97)',
          border: `1px solid ${c.borderColor}`,
          borderRadius: '1.25rem',
          padding: '2rem 2rem 1.75rem',
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {/* Close X */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'var(--text-muted)', borderRadius: '50%',
            width: 30, height: 30, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: c.iconBg, color: c.iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          {c.icon}
        </div>

        {/* Title */}
        <h3 style={{
          textAlign: 'center', fontSize: '1.2rem', fontWeight: 800,
          color: c.titleColor, marginBottom: '0.6rem',
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          textAlign: 'center', fontSize: '0.875rem',
          color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem',
        }}>
          {message}
        </p>

        {/* Action button */}
        <button
          className={`btn btn-full ${c.btnClass}`}
          onClick={onAction || onClose}
          style={{ padding: '0.75rem' }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
