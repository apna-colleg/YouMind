import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2 } from 'lucide-react';
import * as notesService from '../services/notesService';

export default function BacklinksPanel({ noteId }) {
  const [backlinks, setBacklinks] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!noteId) return;

    const loadBacklinks = async () => {
      try {
        const data = await notesService.fetchBacklinks(noteId);
        setBacklinks(data);
      } catch (err) {
        console.error('Failed to load backlinks:', err);
      }
    };

    loadBacklinks();
  }, [noteId]);

  if (backlinks.length === 0) return null;

  return (
    <div className="backlinks-panel">
      <div className="backlinks-header" onClick={() => setExpanded(!expanded)}>
        <ArrowLeft size={14} style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(0)' }} />
        <Link2 size={14} />
        Backlinks
        <span className="count">{backlinks.length}</span>
      </div>

      {expanded && (
        <div className="backlinks-list">
          {backlinks.map((link) => (
            <div
              key={link.id}
              className="backlink-item"
              onClick={() => navigate(`/note/${link.id}`)}
            >
              <Link2 size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <span className="backlink-item-title">{link.title || 'Untitled'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
