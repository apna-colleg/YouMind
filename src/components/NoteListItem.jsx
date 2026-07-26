import { FileText } from 'lucide-react';

export default function NoteListItem({ note, isActive, onClick, onContextMenu }) {
  return (
    <div
      className={`note-list-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(note.id)}
      onContextMenu={(e) => onContextMenu?.(e, note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(note.id)}
    >
      <FileText size={16} />
      <span className="note-list-item-title" style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {note.is_pinned && '📌 '}
        {note.title || 'Untitled'}
      </span>
    </div>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
