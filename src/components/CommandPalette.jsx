import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Plus,
  Network,
  Tag,
  Zap,
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import { fuzzySearch } from '../services/searchService';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { notes, tags, createNote, setFilter } = useNotes();

  // Open/close handlers
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close]);

  // Listen for custom event from sidebar
  useEffect(() => {
    const handler = () => open();
    window.addEventListener('open-command-palette', handler);
    return () => window.removeEventListener('open-command-palette', handler);
  }, [open]);

  // Build results
  const rawNotes = query
    ? fuzzySearch(notes, query)
    : notes.filter((n) => !n.is_archived);

  // Deduplicate by title to only show different notes
  const noteResults = rawNotes.filter((v, i, a) => 
    a.findIndex(t => (t.title || 'Untitled') === (v.title || 'Untitled')) === i
  ).slice(0, 6);

  const tagResults = query
    ? tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const actions = [
    {
      title: 'Create new note',
      icon: <Plus size={16} />,
      action: async () => {
        const note = await createNote(query || 'Untitled');
        if (note) navigate(`/note/${note.id}`);
        close();
      },
    },
    {
      title: 'Open graph view',
      icon: <Network size={16} />,
      action: () => {
        navigate('/graph');
        close();
      },
    },
  ].filter((a) => {
    if (!query) return true;
    return a.title.toLowerCase().includes(query.toLowerCase());
  });

  // All items flattened for keyboard navigation
  const allItems = [
    ...noteResults.map((n) => ({ type: 'note', data: n })),
    ...tagResults.map((t) => ({ type: 'tag', data: t })),
    ...actions.map((a) => ({ type: 'action', data: a })),
  ];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev >= allItems.length - 1 ? 0 : prev + 1
      );
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? allItems.length - 1 : prev - 1
      );
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item) executeItem(item);
    }
  };

  const executeItem = (item) => {
    if (item.type === 'note') {
      navigate(`/note/${item.data.id}`);
      close();
    } else if (item.type === 'tag') {
      setFilter(item.data.id);
      close();
    } else if (item.type === 'action') {
      item.data.action();
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="command-palette-overlay" onClick={close}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="command-palette-input-wrapper">
          <Search size={18} />
          <input
            ref={inputRef}
            className="command-palette-input"
            type="text"
            placeholder="Search notes, tags, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <div className="command-palette-results">
          {allItems.length === 0 && (
            <div className="command-palette-empty">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Notes */}
          {noteResults.length > 0 && (
            <div className="command-palette-group">
              <div className="command-palette-group-title">Notes</div>
              {noteResults.map((note) => {
                const idx = flatIndex++;
                return (
                  <div
                    key={note.id}
                    className={`command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => executeItem({ type: 'note', data: note })}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <FileText size={16} className="command-palette-item-icon" />
                    <span className="command-palette-item-title">
                      {note.title || 'Untitled'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tags */}
          {tagResults.length > 0 && (
            <div className="command-palette-group">
              <div className="command-palette-group-title">Tags</div>
              {tagResults.map((tag) => {
                const idx = flatIndex++;
                return (
                  <div
                    key={tag.id}
                    className={`command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => executeItem({ type: 'tag', data: tag })}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <Tag size={16} className="command-palette-item-icon" />
                    <span className="command-palette-item-title">
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: tag.color,
                          display: 'inline-block',
                          marginRight: 8,
                        }}
                      />
                      {tag.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="command-palette-group">
              <div className="command-palette-group-title">Actions</div>
              {actions.map((action, i) => {
                const idx = flatIndex++;
                return (
                  <div
                    key={action.title}
                    className={`command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => executeItem({ type: 'action', data: action })}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="command-palette-item-icon">{action.icon}</span>
                    <span className="command-palette-item-title">{action.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
