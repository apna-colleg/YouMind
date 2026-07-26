import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Menu, Plus } from 'lucide-react';

import WikiLink from '../extensions/WikiLinkExtension.jsx';
import EditorToolbar from './EditorToolbar';
import BacklinksPanel from './BacklinksPanel';
import TagPill from './TagPill';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import * as notesService from '../services/notesService';

export default function Editor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateNote, activeNote, setActiveNoteId, saveStatus, setSaveStatus } = useNotes();

  const [title, setTitle] = useState('');
  const [noteTags, setNoteTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const saveTimerRef = useRef(null);
  const titleRef = useRef(null);

  // Load note data when noteId changes
  useEffect(() => {
    if (!noteId) return;

    setActiveNoteId(noteId);

    const loadNote = async () => {
      try {
        const note = await notesService.fetchNote(noteId);
        setTitle(note.title || '');

        // Set editor content
        if (editor && note.content && Object.keys(note.content).length > 0) {
          editor.commands.setContent(note.content);
        } else if (editor) {
          editor.commands.setContent('');
        }

        // Load tags
        const tags = await notesService.fetchNoteTags(noteId);
        setNoteTags(tags);
      } catch (err) {
        console.error('Failed to load note:', err);
      }
    };

    loadNote();
  }, [noteId, setActiveNoteId]);

  // Load all tags for tag picker
  useEffect(() => {
    if (!user) return;
    notesService.fetchTags(user.id).then(setAllTags).catch(console.error);
  }, [user]);

  // Wiki-link navigation handler
  useEffect(() => {
    const handleWikiLink = async (e) => {
      const { title: linkTitle } = e.detail;
      if (!user || !linkTitle) return;

      try {
        const note = await notesService.findOrCreateNoteByTitle(user.id, linkTitle);
        if (note) {
          navigate(`/app/note/${note.id}`);
        }
      } catch (err) {
        console.error('Wiki-link navigation failed:', err);
      }
    };

    window.addEventListener('navigate-wikilink', handleWikiLink);
    return () => window.removeEventListener('navigate-wikilink', handleWikiLink);
  }, [user, navigate]);

  // Auto-save debounce
  const debouncedSave = useCallback(
    (content) => {
      if (!noteId) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaveStatus('saving');

      saveTimerRef.current = setTimeout(async () => {
        try {
          await updateNote(noteId, { content });
          // Sync wiki-links
          const wikiLinks = extractWikiLinks(content);
          if (wikiLinks.length > 0 && user) {
            const linkNoteIds = [];
            for (const linkTitle of wikiLinks) {
              try {
                const linkedNote = await notesService.findNoteByTitle(user.id, linkTitle);
                if (linkedNote) linkNoteIds.push(linkedNote.id);
              } catch {
                // Note doesn't exist yet, skip
              }
            }
            await notesService.syncLinks(noteId, linkNoteIds);
          }
        } catch (err) {
          console.error('Auto-save failed:', err);
          setSaveStatus('error');
        }
      }, 1500);
    },
    [noteId, updateNote, user, setSaveStatus]
  );

  // Title change handler
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus('saving');

    saveTimerRef.current = setTimeout(() => {
      updateNote(noteId, { title: newTitle });
    }, 1500);
  };

  // Title keydown — Enter moves to editor
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus('start');
    }
  };

  // Add tag to note
  const handleAddTag = async (tagId) => {
    try {
      await notesService.addTagToNote(noteId, tagId);
      const tag = allTags.find((t) => t.id === tagId);
      if (tag && !noteTags.find((t) => t.id === tagId)) {
        setNoteTags((prev) => [...prev, tag]);
      }
    } catch (err) {
      console.error('Failed to add tag:', err);
    }
  };

  // Remove tag from note
  const handleRemoveTag = async (tagId) => {
    try {
      await notesService.removeTagFromNote(noteId, tagId);
      setNoteTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (err) {
      console.error('Failed to remove tag:', err);
    }
  };

  // Quick tag creation
  const handleCreateTag = async () => {
    const name = window.prompt('Tag name:');
    if (!name || !user) return;

    const colors = ['#d97706', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    try {
      const tag = await notesService.createTag(user.id, name, color);
      setAllTags((prev) => [...prev, tag]);
      await notesService.addTagToNote(noteId, tag.id);
      setNoteTags((prev) => [...prev, tag]);
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  const [, setEditorTick] = useState(0);

  // Tiptap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'editor-image' },
      }),
      Placeholder.configure({
        placeholder: "Start writing, or type '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Highlight.configure({ multicolor: true }),
      WikiLink,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      debouncedSave(json);
    },
    onSelectionUpdate: () => {
      setEditorTick((t) => t + 1);
    },
    onTransaction: () => {
      setEditorTick((t) => t + 1);
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  });

  // Cleanup save timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);




  if (!noteId) {
    return (
      <div className="empty-state-notion" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="empty-state-content" style={{ textAlign: 'center' }}>
          <h1 className="empty-state-heading">Select a note</h1>
          <p className="empty-state-subtext" style={{ opacity: 1 }}>
            Choose a note from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  // Available tags not already on this note
  const availableTags = allTags.filter(
    (t) => !noteTags.find((nt) => nt.id === t.id)
  );

  return (
    <div className="editor-container">
      {/* Editor Header with Title */}
      <div className="editor-header">
        <input
          ref={titleRef}
          className="editor-title-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled"
          spellCheck={false}
        />
      </div>

      {/* Tag Bar */}
      <div className="editor-tag-bar">
        {noteTags.map((tag) => (
          <TagPill
            key={tag.id}
            tag={tag}
            onRemove={handleRemoveTag}
          />
        ))}
        {availableTags.length > 0 && (
          <select
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-xs)',
              padding: '2px 6px',
              cursor: 'pointer',
            }}
            value=""
            onChange={(e) => {
              if (e.target.value === '__new__') {
                handleCreateTag();
              } else if (e.target.value) {
                handleAddTag(e.target.value);
              }
            }}
          >
            <option value="">+ Add tag</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
            <option value="__new__">Create new tag...</option>
          </select>
        )}
        {availableTags.length === 0 && noteTags.length === 0 && (
          <button
            className="btn-ghost btn-sm"
            onClick={handleCreateTag}
            style={{ fontSize: 'var(--text-xs)' }}
          >
            + Create tag
          </button>
        )}

        {/* Save status */}
        <div className={`save-status ${saveStatus}`} style={{ marginLeft: 'auto' }}>
          <span className="dot" />
          <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Error' : 'Saved'}</span>
        </div>
      </div>

      {/* Fixed Toolbar */}
      {editor && (
        <div style={{ padding: '0 var(--space-8)', maxWidth: 'var(--editor-max-width)', width: '100%', margin: '0 auto' }}>
          <EditorToolbar editor={editor} />
        </div>
      )}

      {/* Editor Body */}
      <div className="editor-body">
        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Backlinks */}
      <BacklinksPanel noteId={noteId} />
    </div>
  );
}

/**
 * Extract all wiki-link titles from Tiptap JSON content.
 */
function extractWikiLinks(content) {
  const titles = [];

  const walk = (node) => {
    if (node.type === 'wikiLink' && node.attrs?.title) {
      titles.push(node.attrs.title);
    }
    if (node.content) {
      node.content.forEach(walk);
    }
  };

  if (content && content.content) {
    content.content.forEach(walk);
  }

  return [...new Set(titles)];
}
