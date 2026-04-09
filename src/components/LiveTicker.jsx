import { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export default function LiveTicker() {
  const { withdrawals } = useStore();
  const items = [...withdrawals, ...withdrawals]; // duplicate for seamless loop

  return (
    <div className="ticker-wrapper">
      <div className="ticker-inner">
        {items.map((w, i) => (
          <span key={i} className="ticker-item">
            <span className="dot">🟢</span>
            <span>{w.phone}</span>
            <span className="amount">✓ Withdrawal {w.amount}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>• {w.time}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
