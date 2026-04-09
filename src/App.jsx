import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Earnings from './pages/Earnings';
import Plans from './pages/Plans';
import './index.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, assessmentDone } = useStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!assessmentDone) return <Navigate to="/assessment" replace />;
  return children;
}

function AssessmentRoute({ children }) {
  const { isAuthenticated, assessmentDone } = useStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (assessmentDone) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, assessmentDone } = useStore();
  if (isAuthenticated && !assessmentDone) return <Navigate to="/assessment" replace />;
  if (isAuthenticated && assessmentDone) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/assessment" element={<AssessmentRoute><Assessment /></AssessmentRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
