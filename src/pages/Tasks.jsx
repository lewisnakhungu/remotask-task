import { useState } from 'react';
import { Clock, CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlansModal from '../components/PlansModal';
import UnlockTaskModal from '../components/UnlockTaskModal';
import useStore from '../store/useStore';

const CATEGORY_COLORS = {
  Survey: 'badge-purple',
  Sentiment: 'badge-blue',
  Labeling: 'badge-orange',
  Classification: 'badge-green',
  Transcription: 'badge-pink',
  Review: 'badge-blue',
};

export default function Tasks() {
  const { tasks, completedTaskIds, unlockedTaskIds, canDoMoreTasks, plan, getDailyLimit, tasksCompletedToday } = useStore();
  const [filter, setFilter] = useState('all');
  const [unlockTaskInfo, setUnlockTaskInfo] = useState(null);

  const categories = ['all', ...new Set(tasks.map(t => t.category))];
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);
  const dailyLimit = getDailyLimit();
  const needsActivation = !plan;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Available Tasks</h1>
            <p className="page-sub">
              {tasksCompletedToday}/{dailyLimit} tasks completed today
              {!plan && <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: 600 }}>• Purchase tier to unlock</span>}
            </p>
          </div>
        </div>

        {/* Daily progress */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Daily Progress</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tasksCompletedToday} of {dailyLimit} tasks</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (tasksCompletedToday / dailyLimit) * 100)}%`, background: 'linear-gradient(90deg, var(--primary), #7c3aed)', borderRadius: 4, transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tasks grid */}
        <div className="tasks-grid">
          {filtered.map(task => {
            const completed = completedTaskIds.includes(task.id);
            const blocked = !completed && !canDoMoreTasks();

            return (
              <div key={task.id} className="task-card" style={{ opacity: completed ? 0.7 : 1 }}>
                <div className="task-card-header">
                  <span className="task-icon">{task.icon}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="task-reward">KES {task.reward}</div>
                    <span className={`badge ${CATEGORY_COLORS[task.category] || 'badge-purple'}`} style={{ marginTop: '0.25rem' }}>
                      {task.category}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-desc">{task.description}</div>
                </div>
                <div className="task-meta">
                  <span className="task-time"><Clock size={12} /> {task.time}</span>
                  {completed ? (
                    <span className="task-completed"><CheckCircle size={14} /> Completed</span>
                  ) : task.isPremium && !(unlockedTaskIds || []).includes(task.id) ? (
                    <button className="btn btn-sm" style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#ca8a04', gap: '0.3rem', display: 'flex', alignItems: 'center' }} onClick={() => setUnlockTaskInfo(task)}>
                      <Lock size={12} /> Unlock KES {task.unlockFee}
                    </button>
                  ) : blocked ? (
                    <button className="btn btn-sm" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', gap: '0.3rem', display: 'flex', alignItems: 'center' }} disabled>
                      <Lock size={12} /> Limit Reached
                    </button>
                  ) : (
                    <Link to={`/tasks/${task.id}`} className="btn btn-primary btn-sm" id={`task-${task.id}-start`}>
                      Start →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gateway overlay — shown automatically if no active plan */}
      {needsActivation && <PlansModal isGateway={true} onClose={() => {}} />}

      {unlockTaskInfo && <UnlockTaskModal task={unlockTaskInfo} onClose={() => setUnlockTaskInfo(null)} />}
    </div>
  );
}

