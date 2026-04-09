import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle, Target, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import LiveTicker from '../components/LiveTicker';
import WithdrawModal from '../components/WithdrawModal';
import UpgradeModal from '../components/UpgradeModal';
import PlansModal from '../components/PlansModal';
import useStore from '../store/useStore';

export default function Dashboard() {
  const { user, balance, tasksCompletedToday, accuracyRate, plan, earnings, getDailyLimit, tasks, completedTaskIds, assessmentDone } = useStore();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPlansPopup, setShowPlansPopup] = useState(false);

  // Trigger plans modal after screening + login
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('plansPrompted');
    if (assessmentDone && !plan && !hasPrompted) {
      const timer = setTimeout(() => {
        setShowPlansPopup(true);
        sessionStorage.setItem('plansPrompted', 'true');
      }, 1000); // Small delay for effect
      return () => clearTimeout(timer);
    }
  }, [assessmentDone, plan]);

  const availableTasks = tasks.filter(t => !completedTaskIds.includes(t.id)).slice(0, 3);
  const dailyLimit = getDailyLimit();

  const stats = [
    { icon: '💰', label: 'Available Balance', value: `KES ${balance.toLocaleString()}`, cls: 'green', iconBg: 'green' },
    { icon: '✅', label: 'Tasks Completed', value: tasksCompletedToday, iconBg: 'blue' },
    { icon: '🎯', label: 'Accuracy Rate', value: `${accuracyRate}%`, iconBg: 'purple' },
    { icon: '⏱️', label: 'Daily Tasks Left', value: `${Math.max(0, dailyLimit - tasksCompletedToday)}/${dailyLimit}`, iconBg: 'orange' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <LiveTicker />

      <div className="main-content">
        {/* Welcome + action */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="page-sub">
              {plan ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Active` : 'Free Account'} •
              {' '}{new Date().toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-success" onClick={() => setShowWithdraw(true)} id="withdraw-btn">
              💸 Withdraw
            </button>
            {!plan && (
              <button className="btn btn-primary" onClick={() => setShowUpgrade(true)} id="upgrade-btn">
                🚀 Upgrade Plan
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.iconBg}`}>{s.icon}</div>
              <div className={`stat-value ${s.cls || ''}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upgrade banner for free users */}
        {!plan && (
          <div style={{ background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(147,51,234,0.3)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>🔒 Unlock Your Full Earnings Potential</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Free accounts are limited to 3 tasks/day. Upgrade to earn up to KES 8,000/month.</div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowUpgrade(true)}>
              Upgrade Now →
            </button>
          </div>
        )}

        {/* Available tasks preview */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Available Tasks</h2>
            <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {availableTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <div className="empty-state-title">All tasks completed!</div>
              <div className="empty-state-desc">Check back tomorrow for more tasks.</div>
            </div>
          ) : (
            <div className="tasks-grid">
              {availableTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-card-header">
                    <span className="task-icon">{task.icon}</span>
                    <span className="task-reward">KES {Math.round(task.reward * 130)}</span>
                  </div>
                  <div>
                    <div className="task-title">{task.title}</div>
                    <div className="task-desc">{task.description}</div>
                  </div>
                  <div className="task-meta">
                    <span className="task-time"><Clock size={12} /> {task.time}</span>
                    <Link to={`/tasks/${task.id}`} className="btn btn-primary btn-sm" id={`start-task-${task.id}`}>
                      Start →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent earnings */}
        {earnings.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recent Earnings</h2>
              <Link to="/earnings" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="earnings-table-wrap">
                <table className="earnings-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.slice(0, 4).map(e => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 500 }}>{e.description}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(e.date).toLocaleDateString()}</td>
                        <td className={e.amount > 0 ? 'amount-positive' : 'amount-negative'}>
                          {e.amount > 0 ? '+' : ''}KES {Math.abs(e.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onNeedUpgrade={() => setShowUpgrade(true)}
        />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showPlansPopup && <PlansModal onClose={() => setShowPlansPopup(false)} />}
    </div>
  );
}
