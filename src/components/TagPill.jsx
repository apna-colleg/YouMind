export default function TagPill({ tag, onRemove, onClick, size = 'sm' }) {
  const bgColor = tag.color ? `${tag.color}20` : 'var(--color-bg-tertiary)';
  const textColor = tag.color || 'var(--color-text-secondary)';

  return (
    <span
      className={`tag-pill ${size === 'lg' ? 'tag-pill-lg' : ''}`}
      style={{
        background: bgColor,
        color: textColor,
        border: `1px solid ${tag.color || 'var(--color-border)'}30`,
      }}
      onClick={onClick}
      title={tag.name}
    >
      <span className="tag-dot" style={{ background: tag.color || 'var(--color-text-muted)' }} />
      {tag.name}
      {onRemove && (
        <span
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag.id);
          }}
          role="button"
          aria-label={`Remove tag ${tag.name}`}
        >
          ×
        </span>
      )}
    </span>
  );
}
