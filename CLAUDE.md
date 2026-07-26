# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**YouMind** — A Notion-like personal knowledge base / second brain application built with React, Supabase, and Tiptap. Features include rich text editing with wiki-links, backlinks, tagging, graph view, command palette, and a warm dark-mode design system.

**Tech Stack:**
- **Framework:** React 19 + Vite 8 (ESM)
- **Routing:** React Router v7
- **Auth & Database:** Supabase (PostgreSQL + Auth)
- **Editor:** Tiptap v3 (ProseMirror-based) with extensions for tables, tasks, code blocks, highlights, images, links, wiki-links
- **Graph Visualization:** D3-force (d3 v7)
- **Styling:** Custom CSS with comprehensive design tokens (CSS variables) — no Tailwind
- **Linting:** Oxlint (with React plugin)
- **Icons:** Lucide React

---

## Project Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Routes, providers, protected/public routes
├── index.css                # Design system (tokens, components, utilities) — ~1800 lines
├── lib/
│   └── supabaseClient.js    # Supabase client singleton (uses VITE_SUPABASE_*)
├── contexts/
│   ├── AuthContext.jsx      # Supabase auth (Google OAuth), session management
│   └── NotesContext.jsx     # Notes/tags state, CRUD operations, filtering
├── services/
│   ├── notesService.js      # Supabase queries: notes, tags, links, backlinks, graph data
│   └── searchService.js     # Client-side fuzzy search + remote Supabase ilike search
├── components/
│   ├── AppLayout.jsx        # Sidebar + main content layout, mobile responsive
│   ├── Sidebar.jsx          # Navigation, filters, tags, note list, context menu
│   ├── Editor.jsx           # Main editor page: title, tags, toolbar, Tiptap, backlinks
│   ├── EditorToolbar.jsx    # Notion-style floating toolbar (text types, formatting, colors)
│   ├── SlashCommandMenu.jsx # "/" slash command menu in editor
│   ├── CommandPalette.jsx   # Cmd+K global search (notes, tags, actions)
│   ├── BacklinksPanel.jsx   # Backlinks panel at bottom of editor
│   ├── TagPill.jsx          # Tag display component
│   ├── NoteListItem.jsx     # Sidebar note list item
│   └── EditorContent.jsx    # (if exists) Tiptap content wrapper
├── extensions/
│   └── WikiLinkExtension.jsx # Custom Tiptap node for [[wiki-links]]
└── pages/
    ├── LandingPage.jsx      # Marketing landing page (Notion-style)
    ├── LoginPage.jsx        # Google OAuth login
    └── GraphView.jsx        # D3 force-directed graph of note connections
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run Oxlint (fast, Rust-based linter) |
| `npm run preview` | Preview production build |

**Environment Setup:**
- Copy `.env.example` to `.env` and add your Supabase credentials
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Architecture & Key Patterns

### 1. Context-Based State Management
Two primary contexts wrap the app:
- **AuthContext** — Manages Supabase session, user, sign-in/out
- **NotesContext** — Client-side cache of notes, tags, active note, filters, save status; wraps `NotesProvider` around `/app` routes

Components consume via `useAuth()` / `useNotes()` hooks. All mutations go through `notesService` → Supabase → context state update.

### 2. Routing Structure
```
/                     → LandingPage (public)
/login                → LoginPage (public)
/app                  → Protected: AppLayout + NotesProvider
  / (index)           → EmptyState (create new note)
  /note/:noteId       → Editor component
  /graph              → GraphView component
```

Protected routes redirect to `/login` if unauthenticated; public routes redirect to `/app` if authenticated.

### 3. Editor Architecture (Tiptap)
- **Editor.jsx** creates `useEditor` instance with extensions:
  - StarterKit (headings 1-3, lists, code, blockquote, HR)
  - Link, Image, Placeholder, TaskList, TaskItem, Table, Underline, Highlight
  - **Custom:** `WikiLink` node extension for `[[title]]` syntax
- **EditorToolbar.jsx** — Notion-style dropdown for block types + inline formatting buttons + highlight color picker
- **SlashCommandMenu.jsx** — Triggered on `/` in editor, filters commands fuzzy
- **Auto-save:** Debounced (1.5s) on content change + title change; syncs wiki-links to `note_links` table
- **Wiki-link navigation:** Custom event `navigate-wikilink` dispatched from `WikiLinkComponent` → handled in Editor → `findOrCreateNoteByTitle` → navigate

### 4. Data Model (Supabase Tables)
| Table | Purpose |
|-------|---------|
| `notes` | `id, user_id, title, content (jsonb), is_pinned, is_archived, created_at, updated_at` |
| `tags` | `id, user_id, name, color, created_at` |
| `note_tags` | Junction: `note_id, tag_id` |
| `note_links` | Wiki-link graph: `source_note_id, target_note_id` (unique composite) |

Row Level Security (RLS) policies expected on all tables (user_id = auth.uid()).

### 5. Design System (index.css)
All styling via CSS custom properties (design tokens):
- **Colors:** Neutral dark theme (`#191919` bg), warm accent (`#d97706` / `#2eaadc` for links/graph)
- **Typography:** Inter (UI) + JetBrains Mono (code)
- **Spacing:** 4px base unit (`--space-1` through `--space-20`)
- **Radius:** `--radius-sm` to `--radius-2xl`, `--radius-full`
- **Shadows:** Warm-tinted shadows (`rgba(10,8,6,...)`)
- **Z-index scale:** `--z-base` to `--z-max`
- **Layout constants:** `--sidebar-width: 280px`, `--header-height: 48px`, `--editor-max-width: 740px`, `--backlinks-width: 300px`

Component classes: `.btn`, `.btn-primary/secondary/ghost`, `.btn-icon/sm/lg`, `.tag-pill`, `.sidebar`, `.editor-container`, `.tiptap`, `.notion-toolbar`, `.command-palette`, `.graph-view`, etc.

### 6. Key Features Implementation

**Wiki-Links (`[[Title]]`):**
- `WikiLinkExtension.jsx` defines a Tiptap `Node` (inline, atom)
- Input rule: `/\[\[([^\]]+)\]\]$/` → replaces with `wikiLink` node
- `WikiLinkComponent` renders clickable pill; click dispatches `navigate-wikilink` event
- On save: `extractWikiLinks()` walks JSON → `syncLinks()` upserts `note_links`

**Backlinks:**
- `fetchBacklinks(noteId)` queries reverse `note_links`
- `BacklinksPanel` renders at bottom of editor, collapsible

**Graph View:**
- `fetchAllLinks(userId)` returns `{ nodes: [{id, title, connections, isPinned}], links: [{source_note_id, target_note_id}] }`
- D3 force simulation: link, charge, center, collision forces
- Hover highlights connected nodes/edges; click navigates to note

**Command Palette (Cmd+K):**
- Global listener in `CommandPalette.jsx`
- Fuzzy search (`searchService.fuzzySearch`) on local notes + tags
- Actions: create note, open graph view
- Keyboard nav (↑/↓/Enter/Escape)

**Tags:**
- Per-user tags with colors
- Tag filter in sidebar (click tag → filters note list)
- Tag pills in editor tag bar with create/remove

---

## Development Notes

### Adding New Tiptap Extensions
1. Install package (e.g., `@tiptap/extension-...`)
2. Import in `Editor.jsx`
3. Add to `extensions` array in `useEditor`
4. Add CSS styles in `index.css` under `/* Tiptap Editor Styles */`

### Database Migrations
Run via Supabase CLI or dashboard. Key tables need RLS:
```sql
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own notes" ON notes FOR ALL USING (auth.uid() = user_id);
-- Repeat for tags, note_tags, note_links
```

### Linting
Oxlint config in `.oxlintrc.json`:
- React hooks rules (error)
- `react/only-export-components` (warn, allows constants)

Run `npm run lint` before committing.

### Mobile Responsiveness
- Sidebar collapses to overlay (< 768px) via `isMobile` state in `AppLayout`
- CSS media queries in `index.css` handle sidebar transform, editor padding
- `Sidebar` receives `isMobile` prop to auto-close on navigation

### Performance Considerations
- Notes loaded once per session into NotesContext; filtered client-side
- Graph view fetches all links on mount (could paginate for large graphs)
- Debounced auto-save (1.5s) reduces Supabase writes
- Fuzzy search is client-side only (fast for <1000 notes); remote search available via `searchService.remoteSearch`

---

## Common Tasks

**Add a new editor block type:**
1. Add extension in `Editor.jsx`
2. Add toolbar item in `EditorToolbar.jsx` (textTypes array or new button)
3. Add slash command in `SlashCommandMenu.jsx` (COMMANDS array)
4. Style in `index.css` (`.tiptap` section)

**Add a new sidebar filter:**
1. Add filter value to `NotesContext` filter state
2. Update `filteredNotes` logic in `NotesContext`
3. Add nav item in `Sidebar.jsx` with `handleFilterClick`

**Extend Graph View:**
- Modify `fetchAllLinks` in `notesService.js` to return additional node data
- Update `GraphView.jsx` render to use new fields (e.g., color by tag, size by word count)

**Customize Design Tokens:**
Edit `:root` variables in `index.css` — colors, spacing, typography, shadows all centralized.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

See `.env.example` for template.

---

## Debugging Tips

- **Auth issues:** Check Supabase dashboard → Authentication → Users; verify redirect URL matches `window.location.origin`
- **Editor not saving:** Check browser console for Supabase errors; verify RLS policies; check `saveStatus` in NotesContext
- **Graph empty:** Verify `note_links` table has rows; check `fetchAllLinks` query in Network tab
- **Wiki-links not working:** Ensure `WikiLink` extension is in Editor extensions; check input rule regex matches your typing pattern