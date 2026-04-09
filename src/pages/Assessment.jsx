import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const QUESTIONS = [
  {
    id: 1,
    type: 'word_order',
    prompt: 'Arrange these words to form a correct sentence:',
    words: ['sleeping', 'The', 'mat', 'is', 'cat', 'on', 'the'],
    answer: 'The cat is sleeping on the mat',
  },
  {
    id: 2,
    type: 'category',
    prompt: 'Which category does this item belong to?\n\n"Stock market investment returns 2024"',
    options: ['Sports', 'Finance', 'Entertainment', 'Technology'],
    answer: 'Finance',
  },
  {
    id: 3,
    type: 'spelling',
    prompt: 'Identify the misspelled word:',
    options: ['Receive', 'Achieve', 'Recieve', 'Believe'],
    answer: 'Recieve',
  },
  {
    id: 4,
    type: 'pattern',
    prompt: 'What is the next number in this sequence?\n\n2, 4, 8, 16, __',
    options: ['24', '32', '28', '30'],
    answer: '32',
  },
  {
    id: 5,
    type: 'sentiment',
    prompt: 'Analyze the sentiment of this text:\n\n"I absolutely love this product! Best purchase I\'ve ever made. Completely transformed my daily routine!"',
    options: ['Positive', 'Negative', 'Neutral', 'Mixed'],
    answer: 'Positive',
  },
];

export default function Assessment() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedWords, setSelectedWords] = useState([]);
  const [done, setDone] = useState(false);
  const { completeAssessment, user } = useStore();
  const navigate = useNavigate();

  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  const handleOption = (opt) => {
    setAnswers(a => ({ ...a, [q.id]: opt }));
  };

  const handleWordClick = (word, idx) => {
    const key = `${word}-${idx}`;
    if (selectedWords.includes(key)) return;
    const newWords = [...selectedWords, key];
    setSelectedWords(newWords);
    setAnswers(a => ({ ...a, [q.id]: newWords.map(k => k.split('-')[0]).join(' ') }));
  };

  const removeWord = (key) => {
    const newWords = selectedWords.filter(w => w !== key);
    setSelectedWords(newWords);
    setAnswers(a => ({ ...a, [q.id]: newWords.map(k => k.split('-')[0]).join(' ') }));
  };

  const canProceed = () => {
    if (q.type === 'word_order') return selectedWords.length === q.words.length;
    return !!answers[q.id];
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setSelectedWords([]);
    } else {
      setDone(true);
    }
  };

  const handleContinue = () => {
    completeAssessment();
    navigate('/dashboard');
  };

  if (done) {
    return (
      <div className="assessment-page">
        <div className="assessment-card fade-in">
          <div className="pass-screen">
            <div className="pass-icon">🎉</div>
            <div className="pass-title">Assessment Passed!</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Congratulations {user?.name?.split(' ')[0]}! You've qualified to earn on REMOTASK.
            </p>
            <div style={{ background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '1rem', padding: '1.5rem', margin: '1.5rem 0' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Welcome Bonus Credited! 🎁</div>
              <div className="bonus-amount">KES 600</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Added to your account balance</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--surface2)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--success)' }}>96%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy</div>
              </div>
              <div style={{ background: 'var(--surface2)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>5/5</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions</div>
              </div>
              <div style={{ background: 'var(--surface2)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Verified</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleContinue} id="continue-dashboard-btn">
              Continue to Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page">
      <div style={{ maxWidth: 580, margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, fontSize: '1rem' }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #9333ea, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>⚡</div>
          REMOTASK
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill Verification</div>
      </div>

      <div className="assessment-card slide-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="question-num">Question {current + 1} of {QUESTIONS.length}</div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < current ? 'var(--success)' : i === current ? 'var(--primary)' : 'var(--border)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="question-text" style={{ whiteSpace: 'pre-line' }}>{q.prompt}</div>

        {/* Word order question */}
        {q.type === 'word_order' && (
          <div>
            <div style={{ minHeight: 44, background: 'var(--surface2)', border: '1px dashed var(--border)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {selectedWords.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Click words below to arrange...</span>}
              {selectedWords.map((key, i) => (
                <span key={i} className="word-chip" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', color: '#fff', cursor: 'pointer' }} onClick={() => removeWord(key)}>
                  {key.split('-')[0]}
                </span>
              ))}
            </div>
            <div className="word-bank">
              {q.words.map((w, i) => {
                const key = `${w}-${i}`;
                const used = selectedWords.includes(key);
                return (
                  <span key={key} className={`word-chip ${used ? 'used' : ''}`} onClick={() => !used && handleWordClick(w, i)}>
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Option questions */}
        {(q.type === 'category' || q.type === 'spelling' || q.type === 'pattern' || q.type === 'sentiment') && (
          <div className="options-grid">
            {q.options.map(opt => (
              <button
                key={opt}
                className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                onClick={() => handleOption(opt)}
              >
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${answers[q.id] === opt ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {answers[q.id] === opt && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleNext}
          disabled={!canProceed()}
          id={current === QUESTIONS.length - 1 ? 'finish-assessment-btn' : 'next-question-btn'}
        >
          {current === QUESTIONS.length - 1 ? '✓ Finish Assessment' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}
