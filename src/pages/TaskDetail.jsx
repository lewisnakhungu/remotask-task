import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import PlansModal from '../components/PlansModal';
import useStore from '../store/useStore';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, completedTaskIds, completeTask, canDoMoreTasks } = useStore();
  const task = tasks.find(t => t.id === parseInt(id));

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const completed = completedTaskIds.includes(task?.id);

  if (!task) {
    navigate('/tasks');
    return null;
  }

  if (!canDoMoreTasks() && !completed) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="main-content">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <div className="empty-state-title">Daily Task Limit Reached</div>
            <div className="empty-state-desc" style={{ marginBottom: '1.5rem' }}>Activate your account to complete more tasks today.</div>
            <button className="btn btn-primary" onClick={() => setShowUpgrade(true)}>Activate Account →</button>
          </div>
        </div>
        {showUpgrade && <PlansModal onClose={() => setShowUpgrade(false)} />}
      </div>
    );
  }

  if (submitted || completed) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="main-content">
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Task Completed!</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Great work! Your earnings have been added to your balance.</p>
            <div style={{ background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '1rem', padding: '1.5rem', display: 'inline-block', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>You Earned</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>KES {task.reward}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/tasks')}>More Tasks →</button>
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (qIdx, value) => {
    setAnswers(a => ({ ...a, [qIdx]: value }));
  };

  const allAnswered = task.questions?.every((_, i) => answers[i]);

  const handleSubmit = () => {
    completeTask(task.id);
    setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content">
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1.5rem' }}
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft size={14} /> Back to Tasks
        </button>

        <div className="task-detail-card">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2.5rem' }}>{task.icon}</span>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>{task.title}</h1>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {task.time}
                  </span>
                  <span className={`badge badge-purple`} style={{ fontSize: '0.7rem' }}>{task.category}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)' }}>KES {task.reward}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reward</div>
            </div>
          </div>

          <div style={{ background: 'var(--surface2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Instructions:</strong> {task.description} Please answer each question carefully and honestly. Your responses help AI models improve.
            </p>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {task.questions?.map((q, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q{idx + 1}.</span>
                  {q.text}
                </div>

                {q.type === 'radio' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {q.options.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: answers[idx] === opt ? 'var(--primary-light)' : 'var(--surface2)', border: `2px solid ${answers[idx] === opt ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '0.65rem', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'textarea' && (
                  <textarea
                    className="form-input form-textarea"
                    rows={4}
                    value={answers[idx] || ''}
                    onChange={e => handleAnswer(idx, e.target.value)}
                    placeholder="Type your answer here..."
                    id={`task-q${idx}-textarea`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            className="btn btn-success btn-full btn-lg"
            style={{ marginTop: '2rem' }}
            onClick={handleSubmit}
            disabled={!allAnswered}
            id="submit-task-btn"
          >
            ✓ Submit Task & Earn KES {task.reward}
          </button>
        </div>
      </div>
    </div>
  );
}
