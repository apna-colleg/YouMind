import { supabase } from '../lib/supabaseClient';

// ─── Notes CRUD ───

export async function fetchNotes(userId) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, is_pinned, is_archived, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchNote(noteId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();

  if (error) throw error;
  return data;
}

export async function createNote(userId, title = 'Untitled') {
  const { data, error } = await supabase
    .from('notes')
    .insert({ user_id: userId, title, content: {} })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote(noteId, updates) {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(noteId) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
}

export async function pinNote(noteId, isPinned) {
  return updateNote(noteId, { is_pinned: isPinned });
}

export async function archiveNote(noteId, isArchived) {
  return updateNote(noteId, { is_archived: isArchived });
}

// ─── Tags CRUD ───

export async function fetchTags(userId) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createTag(userId, name, color = '#d97706') {
  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: userId, name, color })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTag(tagId) {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);

  if (error) throw error;
}

// ─── Note-Tag Relations ───

export async function fetchNoteTags(noteId) {
  const { data, error } = await supabase
    .from('note_tags')
    .select('tag_id, tags(id, name, color)')
    .eq('note_id', noteId);

  if (error) throw error;
  return data?.map((nt) => nt.tags) || [];
}

export async function addTagToNote(noteId, tagId) {
  const { error } = await supabase
    .from('note_tags')
    .insert({ note_id: noteId, tag_id: tagId });

  if (error && error.code !== '23505') throw error; // Ignore duplicate
}

export async function removeTagFromNote(noteId, tagId) {
  const { error } = await supabase
    .from('note_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId);

  if (error) throw error;
}

// ─── Note Links (Wiki-links & Backlinks) ───

export async function fetchNoteLinks(noteId) {
  const { data, error } = await supabase
    .from('note_links')
    .select('target_note_id, notes!note_links_target_note_id_fkey(id, title)')
    .eq('source_note_id', noteId);

  if (error) throw error;
  return data?.map((nl) => nl.notes) || [];
}

export async function fetchBacklinks(noteId) {
  const { data, error } = await supabase
    .from('note_links')
    .select('source_note_id, notes!note_links_source_note_id_fkey(id, title)')
    .eq('target_note_id', noteId);

  if (error) throw error;
  return data?.map((nl) => nl.notes) || [];
}

export async function syncLinks(noteId, targetNoteIds) {
  // Delete old links
  await supabase
    .from('note_links')
    .delete()
    .eq('source_note_id', noteId);

  // Insert new links
  if (targetNoteIds.length > 0) {
    const rows = targetNoteIds.map((targetId) => ({
      source_note_id: noteId,
      target_note_id: targetId,
    }));

    const { error } = await supabase
      .from('note_links')
      .insert(rows);

    if (error) throw error;
  }
}

// ─── Find or Create Note by Title (for wiki-links) ───

export async function findNoteByTitle(userId, title) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title')
    .eq('user_id', userId)
    .ilike('title', title)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function findOrCreateNoteByTitle(userId, title) {
  let note = await findNoteByTitle(userId, title);
  if (!note) {
    note = await createNote(userId, title);
  }
  return note;
}

// ─── Fetch all links for graph view ───

export async function fetchAllLinks(userId) {
  // First get all user note IDs
  const { data: notes, error: notesErr } = await supabase
    .from('notes')
    .select('id, title, is_pinned')
    .eq('user_id', userId)
    .eq('is_archived', false);

  if (notesErr) throw notesErr;

  const noteIds = notes.map((n) => n.id);

  if (noteIds.length === 0) return { nodes: [], links: [] };

  const { data: links, error: linksErr } = await supabase
    .from('note_links')
    .select('source_note_id, target_note_id')
    .in('source_note_id', noteIds);

  if (linksErr) throw linksErr;

  // Count connections per note
  const connectionCount = {};
  links.forEach((l) => {
    connectionCount[l.source_note_id] = (connectionCount[l.source_note_id] || 0) + 1;
    connectionCount[l.target_note_id] = (connectionCount[l.target_note_id] || 0) + 1;
  });

  const nodes = notes.map((n) => ({
    id: n.id,
    title: n.title,
    connections: connectionCount[n.id] || 0,
    isPinned: n.is_pinned,
  }));

  return { nodes, links };
}
