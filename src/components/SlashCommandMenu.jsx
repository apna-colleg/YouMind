import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code2,
  Quote,
  Table,
  Image,
  Minus,
  Type,
} from 'lucide-react';

const COMMANDS = [
  {
    title: 'Text',
    desc: 'Plain paragraph text',
    icon: <Type size={18} />,
    command: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    desc: 'Large heading',
    icon: <Heading1 size={18} />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    desc: 'Medium heading',
    icon: <Heading2 size={18} />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    desc: 'Small heading',
    icon: <Heading3 size={18} />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    desc: 'Unordered list',
    icon: <List size={18} />,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    desc: 'Ordered list',
    icon: <ListOrdered size={18} />,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Checklist',
    desc: 'Task list with checkboxes',
    icon: <CheckSquare size={18} />,
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Code Block',
    desc: 'Syntax-highlighted code',
    icon: <Code2 size={18} />,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Quote',
    desc: 'Blockquote',
    icon: <Quote size={18} />,
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Table',
    desc: 'Insert a table',
    icon: <Table size={18} />,
    command: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Image',
    desc: 'Upload or embed an image',
    icon: <Image size={18} />,
    command: (editor) => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    title: 'Divider',
    desc: 'Horizontal rule',
    icon: <Minus size={18} />,
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

const SlashCommandMenu = forwardRef(({ editor, onClose }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? filteredCommands.length - 1 : prev - 1
        );
        return true;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev >= filteredCommands.length - 1 ? 0 : prev + 1
        );
        return true;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        selectItem(selectedIndex);
        return true;
      }
      if (event.key === 'Escape') {
        onClose?.();
        return true;
      }
      return false;
    },
  }));

  const selectItem = useCallback(
    (index) => {
      const cmd = filteredCommands[index];
      if (cmd) {
        cmd.command(editor);
        onClose?.();
      }
    },
    [filteredCommands, editor, onClose]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (filteredCommands.length === 0) {
    return (
      <div className="slash-menu">
        <div className="slash-menu-item" style={{ color: 'var(--color-text-muted)' }}>
          No matching commands
        </div>
      </div>
    );
  }

  return (
    <div className="slash-menu">
      {filteredCommands.map((cmd, index) => (
        <div
          key={cmd.title}
          className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
          onClick={() => selectItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="slash-menu-item-icon">{cmd.icon}</div>
          <div className="slash-menu-item-text">
            <span className="slash-menu-item-title">{cmd.title}</span>
            <span className="slash-menu-item-desc">{cmd.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

SlashCommandMenu.displayName = 'SlashCommandMenu';

export default SlashCommandMenu;
export { COMMANDS };
