import Navbar from '../components/Navbar';
import useStore from '../store/useStore';

export default function Earnings() {
  const { earnings, balance, tasksCompletedToday } = useStore();

  const totalEarned = earnings.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const totalWithdrawn = Math.abs(earnings.filter(e => e.type === 'withdrawal').reduce((s, e) => s + e.amount, 0));

  const typeIcon = { bonus: '🎁', task: '✅', withdrawal: '💸', payment: '💳' };
  const typeLabel = { bonus: 'Bonus', task: 'Task Reward', withdrawal: 'Withdrawal', payment: 'Plan Payment' };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Earnings</h1>
            <p className="page-sub">Track all your income and withdrawals</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          {[
            { icon: '💰', label: 'Available Balance', value: `KES ${balance.toLocaleString()}`, cls: 'green', bg: 'green' },
            { icon: '📈', label: 'Total Earned', value: `KES ${totalEarned.toLocaleString()}`, bg: 'purple' },
            { icon: '💸', label: 'Total Withdrawn', value: `KES ${totalWithdrawn.toLocaleString()}`, bg: 'blue' },
            { icon: '✅', label: 'Tasks Done Today', value: tasksCompletedToday, bg: 'orange' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.bg}`}>{s.icon}</div>
              <div className={`stat-value ${s.cls || ''}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Transaction History</h2>

          {earnings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No transactions yet</div>
              <div className="empty-state-desc">Complete tasks to start earning!</div>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="earnings-table-wrap">
                <table className="earnings-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date & Time</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map(e => (
                      <tr key={e.id}>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            {typeIcon[e.type]} {typeLabel[e.type]}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', maxWidth: 200 }}>{e.description}</td>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          {new Date(e.date).toLocaleDateString()}<br />
                          <span>{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className={e.amount > 0 ? 'amount-positive' : 'amount-negative'}>
                          {e.amount > 0 ? '+' : ''}KES {Math.abs(e.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
