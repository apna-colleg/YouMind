import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider, useNotes } from './contexts/NotesContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import GraphView from './pages/GraphView';
import AppLayout from './components/AppLayout';
import Editor from './components/Editor';
import { Sparkles, FileText, Database, LayoutTemplate, MoreHorizontal } from 'lucide-react';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;

  return children;
}

function EmptyState() {
  const { createNote } = useNotes();
  const navigate = useNavigate();

  const handleCreateNote = async () => {
    const note = await createNote('Untitled');
    if (note) {
      navigate(`/app/note/${note.id}`);
    }
  };

  return (
    <div className="empty-state-notion">
      <div className="empty-state-content" onClick={handleCreateNote} style={{ cursor: 'text' }}>
        <h1 className="empty-state-heading">New page</h1>
        <p className="empty-state-subtext">Click here to start writing...</p>
      </div>
      <div className="empty-state-action-bar">
        <span className="action-bar-label">Get started with</span>
        <button className="action-bar-btn" onClick={handleCreateNote}><Sparkles size={14} /> Ask AI</button>
        <button className="action-bar-btn" onClick={handleCreateNote}><FileText size={14} /> AI Meeting Notes</button>
        <button className="action-bar-btn" onClick={handleCreateNote}><Database size={14} /> Database</button>
        <button className="action-bar-btn" onClick={handleCreateNote}><LayoutTemplate size={14} /> Templates</button>
        <button className="action-bar-btn icon-only"><MoreHorizontal size={14} /></button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <NotesProvider>
                <AppLayout />
              </NotesProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmptyState />} />
          <Route path="note/:noteId" element={<Editor />} />
          <Route path="graph" element={<GraphView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

