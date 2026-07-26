/**
 * Search service for notes.
 * Combines client-side fuzzy matching with Supabase full-text search.
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Client-side fuzzy search — instant results while typing.
 * Matches against note title and plain-text content.
 */
export function fuzzySearch(notes, query) {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();
  const terms = lowerQuery.split(/\s+/);

  return notes
    .map((note) => {
      const title = (note.title || '').toLowerCase();
      const preview = getPlainText(note.content).toLowerCase();
      const combined = `${title} ${preview}`;

      let score = 0;

      // Exact title match gets highest score
      if (title === lowerQuery) score += 100;
      // Title starts with query
      else if (title.startsWith(lowerQuery)) score += 80;
      // Title contains query
      else if (title.includes(lowerQuery)) score += 60;

      // Check each term
      terms.forEach((term) => {
        if (title.includes(term)) score += 20;
        if (combined.includes(term)) score += 10;
      });

      return { ...note, score };
    })
    .filter((note) => note.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Extract plain text from Tiptap JSON content for search indexing.
 */
export function getPlainText(content) {
  if (!content || !content.content) return '';

  const extractText = (node) => {
    if (node.type === 'text') return node.text || '';
    if (node.content) return node.content.map(extractText).join(' ');
    return '';
  };

  return content.content.map(extractText).join(' ').slice(0, 500);
}

/**
 * Remote full-text search via Supabase.
 * Falls back to ilike if full-text search is not configured.
 */
export async function remoteSearch(userId, query) {
  if (!query || query.trim().length === 0) return [];

  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, is_pinned, is_archived, updated_at')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data || [];
}
