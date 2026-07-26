import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as notesService from '../services/notesService';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pinned' | 'archived' | tag-id
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'

  // Load notes and tags when user signs in
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setTags([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [notesData, tagsData] = await Promise.all([
          notesService.fetchNotes(user.id),
          notesService.fetchTags(user.id),
        ]);
        setNotes(notesData || []);
        setTags(tagsData || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ─── Note Operations ───

  const createNote = useCallback(async (title = 'Untitled') => {
    if (!user) return null;
    try {
      const note = await notesService.createNote(user.id, title);
      setNotes((prev) => [note, ...prev]);
      setActiveNoteId(note.id);
      return note;
    } catch (err) {
      console.error('Failed to create note:', err);
      return null;
    }
  }, [user]);

  const updateNote = useCallback(async (noteId, updates) => {
    try {
      setSaveStatus('saving');
      const updated = await notesService.updateNote(noteId, updates);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, ...updated } : n))
      );
      setSaveStatus('saved');
      return updated;
    } catch (err) {
      console.error('Failed to update note:', err);
      setSaveStatus('error');
      return null;
    }
  }, []);

  const deleteNote = useCallback(async (noteId) => {
    try {
      await notesService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (activeNoteId === noteId) setActiveNoteId(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  }, [activeNoteId]);

  const togglePin = useCallback(async (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    try {
      const updated = await notesService.pinNote(noteId, !note.is_pinned);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_pinned: updated.is_pinned } : n))
      );
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  }, [notes]);

  const toggleArchive = useCallback(async (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    try {
      const updated = await notesService.archiveNote(noteId, !note.is_archived);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_archived: updated.is_archived } : n))
      );
    } catch (err) {
      console.error('Failed to toggle archive:', err);
    }
  }, [notes]);

  // ─── Tag Operations ───

  const createTag = useCallback(async (name, color) => {
    if (!user) return null;
    try {
      const tag = await notesService.createTag(user.id, name, color);
      setTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
      return tag;
    } catch (err) {
      console.error('Failed to create tag:', err);
      return null;
    }
  }, [user]);

  const deleteTag = useCallback(async (tagId) => {
    try {
      await notesService.deleteTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (err) {
      console.error('Failed to delete tag:', err);
    }
  }, []);

  // ─── Filtered Notes ───

  const filteredNotes = notes.filter((note) => {
    if (filter === 'all') return !note.is_archived;
    if (filter === 'pinned') return note.is_pinned && !note.is_archived;
    if (filter === 'archived') return note.is_archived;
    // Filter by tag (filter is a tag ID) – will be implemented when note_tags are loaded
    return !note.is_archived;
  });

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const value = {
    notes,
    filteredNotes,
    tags,
    activeNote,
    activeNoteId,
    loading,
    filter,
    saveStatus,
    setActiveNoteId,
    setFilter,
    setSaveStatus,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    createTag,
    deleteTag,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
