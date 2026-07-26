import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  Highlighter,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Type,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

export default function EditorToolbar({ editor }) {
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const textMenuRef = useRef(null);
  const colorMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (textMenuRef.current && !textMenuRef.current.contains(e.target)) {
        setShowTextMenu(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target)) {
        setShowColorMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Get current text type label
  const getTextTypeLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('bulletList')) return 'Bullet list';
    if (editor.isActive('orderedList')) return 'Numbered list';
    if (editor.isActive('taskList')) return 'To-do list';
    if (editor.isActive('blockquote')) return 'Quote';
    if (editor.isActive('codeBlock')) return 'Code block';
    return 'Text';
  };

  const textTypes = [
    {
      label: 'Text',
      icon: <Type size={14} />,
      action: () => editor.chain().focus().setParagraph().run(),
      active: editor.isActive('paragraph') && !editor.isActive('bulletList') && !editor.isActive('orderedList'),
    },
    {
      label: 'Heading 1',
      icon: <Heading1 size={14} />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'Heading 2',
      icon: <Heading2 size={14} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'Heading 3',
      icon: <Heading3 size={14} />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
    },
    { divider: true },
    {
      label: 'Bullet list',
      icon: <List size={14} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      label: 'Numbered list',
      icon: <ListOrdered size={14} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
    {
      label: 'To-do list',
      icon: <CheckSquare size={14} />,
      action: () => editor.chain().focus().toggleTaskList().run(),
      active: editor.isActive('taskList'),
    },
    { divider: true },
    {
      label: 'Quote',
      icon: <Quote size={14} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote'),
    },
    {
      label: 'Divider',
      icon: <Minus size={14} />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: false,
    },
    {
      label: 'Code block',
      icon: <Code size={14} />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive('codeBlock'),
    },
  ];

  const highlightColors = [
    { name: 'Default', color: null },
    { name: 'Yellow', color: '#fef08a' },
    { name: 'Green', color: '#bbf7d0' },
    { name: 'Blue', color: '#bfdbfe' },
    { name: 'Purple', color: '#e9d5ff' },
    { name: 'Pink', color: '#fbcfe8' },
    { name: 'Red', color: '#fecaca' },
    { name: 'Orange', color: '#fed7aa' },
  ];

  return (
    <div className="notion-toolbar">
      {/* Text Type Dropdown */}
      <div className="toolbar-dropdown" ref={textMenuRef}>
        <button
          className="toolbar-dropdown-trigger"
          onClick={() => setShowTextMenu(!showTextMenu)}
          title="Turn into"
          type="button"
        >
          <span className="toolbar-dropdown-label">{getTextTypeLabel()}</span>
          <ChevronDown size={12} />
        </button>
        {showTextMenu && (
          <div className="toolbar-dropdown-menu">
            {textTypes.map((item, i) =>
              item.divider ? (
                <div key={i} className="toolbar-menu-divider" />
              ) : (
                <button
                  key={i}
                  className={`toolbar-menu-item ${item.active ? 'active' : ''}`}
                  onClick={() => {
                    item.action();
                    setShowTextMenu(false);
                  }}
                  type="button"
                >
                  <span className="toolbar-menu-icon">{item.icon}</span>
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <span className="toolbar-divider" />

      {/* Inline Formatting */}
      <button
        className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold size={15} />
      </button>
      <button
        className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic size={15} />
      </button>
      <button
        className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
        type="button"
      >
        <UnderlineIcon size={15} />
      </button>
      <button
        className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
        type="button"
      >
        <Strikethrough size={15} />
      </button>

      <span className="toolbar-divider" />

      {/* Code & Highlight */}
      <button
        className={`toolbar-btn ${editor.isActive('code') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline code"
        type="button"
      >
        <Code size={15} />
      </button>

      {/* Highlight with Color Picker */}
      <div className="toolbar-dropdown" ref={colorMenuRef}>
        <button
          className={`toolbar-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
          onClick={() => setShowColorMenu(!showColorMenu)}
          title="Highlight"
          type="button"
        >
          <Highlighter size={15} />
        </button>
        {showColorMenu && (
          <div className="toolbar-dropdown-menu color-menu">
            <div className="toolbar-menu-label">Highlight</div>
            <div className="color-grid">
              {highlightColors.map((c, i) => (
                <button
                  key={i}
                  className="color-swatch"
                  title={c.name}
                  style={{
                    background: c.color || 'var(--color-bg-tertiary)',
                    border: !c.color ? '1px dashed var(--color-border)' : 'none',
                  }}
                  onClick={() => {
                    if (c.color) {
                      editor.chain().focus().toggleHighlight({ color: c.color }).run();
                    } else {
                      editor.chain().focus().unsetHighlight().run();
                    }
                    setShowColorMenu(false);
                  }}
                  type="button"
                >
                  {!c.color && <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>×</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <span className="toolbar-divider" />

      {/* Link */}
      <button
        className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`}
        onClick={setLink}
        title="Link (Ctrl+K)"
        type="button"
      >
        <LinkIcon size={15} />
      </button>

      <span className="toolbar-divider" />

      {/* Block-level items */}
      <button
        className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
        type="button"
      >
        <List size={15} />
      </button>
      <button
        className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
        type="button"
      >
        <ListOrdered size={15} />
      </button>
      <button
        className={`toolbar-btn ${editor.isActive('taskList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="To-do list"
        type="button"
      >
        <CheckSquare size={15} />
      </button>

      <span className="toolbar-divider" />

      <button
        className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
        type="button"
      >
        <Quote size={15} />
      </button>
      <button
        className="toolbar-btn"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
        type="button"
      >
        <Minus size={15} />
      </button>
    </div>
  );
}
