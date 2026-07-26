import { getPlainText } from '../services/searchService';

export default function NoteListItem({ note, isActive, onClick, onContextMenu }) {
  const preview = getPlainText(note.content);
  const timeAgo = formatTimeAgo(note.updated_at);

  return (
    <div
      className={`note-list-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(note.id)}
      onContextMenu={(e) => onContextMenu?.(e, note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(note.id)}
    >
      <span className="note-list-item-title">
        {note.is_pinned && '📌 '}
        {note.title || 'Untitled'}
      </span>
      {preview && (
        <span className="note-list-item-preview">{preview}</span>
      )}
      <span className="note-list-item-meta">
        <span>{timeAgo}</span>
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
