import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Brain,
  Plus,
  Search,
  Pin,
  Clock,
  FileText,
  Archive,
  Tag,
  Network,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Library,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import NoteListItem from './NoteListItem';

export default function Sidebar({ isOpen, onToggle, onClose, isMobile }) {
  const { user, signOut } = useAuth();
  const {
    filteredNotes,
    tags,
    notes,
    activeNoteId,
    filter,
    setFilter,
    setActiveNoteId,
    createNote,
    togglePin,
    toggleArchive,
    deleteNote,
  } = useNotes();

  const navigate = useNavigate();
  const location = useLocation();
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [privateExpanded, setPrivateExpanded] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);

  const pinnedCount = notes.filter((n) => n.is_pinned && !n.is_archived).length;
  const allCount = notes.filter((n) => !n.is_archived).length;
  const archivedCount = notes.filter((n) => n.is_archived).length;

  const handleNewNote = async () => {
    const note = await createNote('Untitled');
    if (note) {
      navigate(`/app/note/${note.id}`);
      if (isMobile) onClose();
    }
  };

  const handleNoteClick = (noteId) => {
    setActiveNoteId(noteId);
    navigate(`/app/note/${noteId}`);
    if (isMobile) onClose();
  };

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
    // If navigating away from graph view
    if (location.pathname === '/app/graph') {
      navigate('/app');
    }
  };

  const handleGraphClick = () => {
    navigate('/app/graph');
    if (isMobile) onClose();
  };

  const handleContextMenu = (e, note) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      note,
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <>
      <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
        {/* Header - User Profile */}
        <div className="sidebar-header">
          <div className="sidebar-user" onClick={handleSignOut} title="Sign out" style={{ padding: 'var(--space-1) var(--space-2)', margin: 0, flex: 1 }}>
            {user?.user_metadata?.avatar_url ? (
              <img
                className="sidebar-user-avatar"
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="sidebar-user-avatar"
                style={{
                  background: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-semibold)',
                }}
              >
                {(user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="sidebar-user-name">
              {user?.user_metadata?.full_name || user?.email || 'User'}'s Notion
            </span>
          </div>
          <button
            className="btn-icon"
            onClick={onToggle}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Quick Actions (Nav List) */}
          <div className="sidebar-section">
            <div
              className="sidebar-nav-item"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            >
              <Search size={16} />
              Search
              <span style={{
                marginLeft: 'auto',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg-primary)',
                padding: '2px 4px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>⌘K</span>
            </div>
            <div
              className="sidebar-nav-item"
              onClick={handleNewNote}
            >
              <Plus size={16} />
              New page
            </div>
          </div>

          {/* Smart Filters */}
          <div className="sidebar-section">
            <div
              className={`sidebar-nav-item ${filter === 'pinned' ? 'active' : ''}`}
              onClick={() => handleFilterClick('pinned')}
            >
              <Pin size={16} />
              Pinned
              {pinnedCount > 0 && <span className="count">{pinnedCount}</span>}
            </div>

            <div
              className={`sidebar-nav-item ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              <FileText size={16} />
              All Notes
              <span className="count">{allCount}</span>
            </div>

            <div
              className={`sidebar-nav-item ${filter === 'archived' ? 'active' : ''}`}
              onClick={() => handleFilterClick('archived')}
            >
              <Archive size={16} />
              Archived
              {archivedCount > 0 && <span className="count">{archivedCount}</span>}
            </div>

            <div
              className={`sidebar-nav-item ${location.pathname === '/app/graph' ? 'active' : ''}`}
              onClick={handleGraphClick}
            >
              <Network size={16} />
              Graph View
            </div>
          </div>

          {/* Tags */}
          <div className="sidebar-section">
            <div
              className="sidebar-section-title"
              onClick={() => setTagsExpanded(!tagsExpanded)}
            >
              {tagsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <Tag size={12} />
              Tags
            </div>
            {tagsExpanded && tags.length > 0 && (
              <div>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`sidebar-nav-item ${filter === tag.id ? 'active' : ''}`}
                    onClick={() => handleFilterClick(tag.id)}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: tag.color || 'var(--color-text-muted)',
                        flexShrink: 0,
                      }}
                    />
                    {tag.name}
                  </div>
                ))}
              </div>
            )}
            {tagsExpanded && tags.length === 0 && (
              <div
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  marginLeft: 'var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                No tags yet
              </div>
            )}
          </div>

          {/* Private Note List */}
          <div className="sidebar-section">
            <div
              className="sidebar-section-title private-section-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-1) var(--space-2)',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                fontWeight: '600',
                fontSize: '12px',
                textTransform: 'none',
                letterSpacing: 'normal'
              }}
              onClick={() => setPrivateExpanded(!privateExpanded)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Private {privateExpanded ? <ChevronDown size={14} color="var(--color-text-muted)" /> : <ChevronRight size={14} color="var(--color-text-muted)" />}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Library size={14} style={{ cursor: 'pointer', opacity: 0.8 }} />
                <MoreHorizontal size={14} style={{ cursor: 'pointer', opacity: 0.8 }} />
                <Plus size={14} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={handleNewNote} />
              </div>
            </div>

            {privateExpanded && (
              <div className="sidebar-note-list">
                {filteredNotes
                  .filter((v, i, a) => a.findIndex(t => (t.title || 'Untitled') === (v.title || 'Untitled')) === i)
                  .map((note) => (
                  <NoteListItem
                    key={note.id}
                    note={note}
                    isActive={note.id === activeNoteId}
                    onClick={handleNoteClick}
                    onContextMenu={handleContextMenu}
                  />
                ))}
                {filteredNotes.length === 0 && (
                  <div
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      marginLeft: 'var(--space-2)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    No pages inside
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Footer (Empty since User moved to top) */}
        <div className="sidebar-footer" style={{ padding: 'var(--space-2)' }}>
          {/* Add settings/help links here if needed */}
        </div>
      </aside>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-dropdown)' }}
            onClick={closeContextMenu}
          />
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div
              className="context-menu-item"
              onClick={() => {
                togglePin(contextMenu.note.id);
                closeContextMenu();
              }}
            >
              <Pin size={14} />
              {contextMenu.note.is_pinned ? 'Unpin' : 'Pin to top'}
            </div>
            <div
              className="context-menu-item"
              onClick={() => {
                toggleArchive(contextMenu.note.id);
                closeContextMenu();
              }}
            >
              <Archive size={14} />
              {contextMenu.note.is_archived ? 'Unarchive' : 'Archive'}
            </div>
            <div className="context-menu-divider" />
            <div
              className="context-menu-item destructive"
              onClick={() => {
                deleteNote(contextMenu.note.id);
                closeContextMenu();
              }}
            >
              <FileText size={14} />
              Delete note
            </div>
          </div>
        </>
      )}
    </>
  );
}
