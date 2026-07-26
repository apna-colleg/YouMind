# YouMind — Manual Setup Guide

Follow these steps **in order** to configure the backend services for YouMind.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **"New Project"**.
3. Fill in:
   - **Name**: `youmind` (or any name you prefer)
   - **Database Password**: Choose a strong password and **save it somewhere safe**.
   - **Region**: Pick the closest region to you.
4. Click **"Create new project"** and wait for it to finish provisioning (~2 minutes).

---

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings → API** (left sidebar).
2. Copy these two values:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon (public) key** — a long `eyJ...` string
3. Create a `.env` file in the project root (`c:\Document\Vibe-Coding-Apps\you-mind\.env`):

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Never commit `.env` to Git.** It's already in `.gitignore`.

---

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar).
2. Click **"New query"**.
3. Paste the following SQL and click **"Run"**:

```sql
-- =============================================
-- YouMind Database Schema
-- =============================================

-- Notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled',
  content jsonb default '{}',
  is_pinned boolean default false,
  is_archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags table
create table tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#d97706',
  unique(user_id, name)
);

-- Note-Tag junction table
create table note_tags (
  note_id uuid references notes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

-- Note Links (for wiki-links & backlinks)
create table note_links (
  source_note_id uuid references notes(id) on delete cascade,
  target_note_id uuid references notes(id) on delete cascade,
  primary key (source_note_id, target_note_id)
);

-- Enable Row Level Security on all tables
alter table notes enable row level security;
alter table tags enable row level security;
alter table note_tags enable row level security;
alter table note_links enable row level security;

-- RLS Policies: Users can only access their own data
create policy "Users can CRUD own notes"
  on notes for all using (auth.uid() = user_id);

create policy "Users can CRUD own tags"
  on tags for all using (auth.uid() = user_id);

create policy "Users can CRUD own note_tags"
  on note_tags for all using (
    exists (select 1 from notes where notes.id = note_tags.note_id and notes.user_id = auth.uid())
  );

create policy "Users can CRUD own note_links"
  on note_links for all using (
    exists (select 1 from notes where notes.id = note_links.source_note_id and notes.user_id = auth.uid())
  );

-- Auto-update the updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_updated_at
  before update on notes
  for each row execute function update_updated_at();
```

4. You should see **"Success. No rows returned"** — this means all tables were created.

---

## Step 4: Create a Storage Bucket for Images

1. In your Supabase dashboard, go to **Storage** (left sidebar).
2. Click **"New bucket"**.
3. Fill in:
   - **Name**: `note-images`
   - **Public bucket**: ✅ Toggle ON (so images can be displayed in notes)
4. Click **"Create bucket"**.
5. Go to **Storage → Policies** for the `note-images` bucket.
6. Click **"New Policy"** → **"For full customization"** and create these policies:

**Upload Policy:**
- **Name**: `Users can upload images`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy**: `true`

**Read Policy:**
- **Name**: `Anyone can view images`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy**: `true`

**Delete Policy:**
- **Name**: `Users can delete own images`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy**: `true`

---

## Step 5: Set Up Google OAuth

### 5a. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services → OAuth consent screen**.
4. Choose **External** user type → Click **Create**.
5. Fill in:
   - **App name**: `YouMind`
   - **User support email**: Your email
   - **Developer contact**: Your email
6. Click **Save and Continue** through the remaining steps (Scopes, Test users).
7. Go to **APIs & Services → Credentials**.
8. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**.
9. Choose:
   - **Application type**: `Web application`
   - **Name**: `YouMind Web`
   - **Authorized redirect URIs**: Add this URL:
     ```
     https://your-project-url.supabase.co/auth/v1/callback
     ```
     (Replace `your-project-url` with your actual Supabase project URL from Step 2)
10. Click **Create** and copy:
    - **Client ID**
    - **Client Secret**

### 5b. Configure Google OAuth in Supabase

1. In your Supabase dashboard, go to **Authentication → Providers** (left sidebar).
2. Find **Google** in the list and click to expand.
3. Toggle **Enable Sign in with Google** to ON.
4. Paste:
   - **Client ID** from Step 5a
   - **Client Secret** from Step 5a
5. Click **Save**.

---

## Step 6: Configure Redirect URL

1. In your Supabase dashboard, go to **Authentication → URL Configuration**.
2. Set:
   - **Site URL**: `http://localhost:5173` (for local development)
   - **Redirect URLs**: Add `http://localhost:5173`
3. Click **Save**.

> 💡 When deploying to production, update these URLs to your production domain.

---

## Step 7: Verify Everything Works

Run the app:
```bash
npm run dev
```

1. Open `http://localhost:5173` in your browser.
2. Click "Sign in with Google".
3. After signing in, you should be redirected to the main app.
4. Check your Supabase dashboard → **Authentication → Users** to confirm the user was created.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid redirect URI" error | Double-check the redirect URI in Google Cloud Console matches your Supabase callback URL exactly |
| Google sign-in popup closes instantly | Make sure your Supabase Site URL and Redirect URLs match `http://localhost:5173` |
| Notes not saving | Check the SQL Editor ran without errors. Go to **Table Editor** and verify the `notes` table exists |
| Images not uploading | Verify the `note-images` storage bucket exists and has the correct policies |
| "RLS policy violation" error | Make sure all 4 RLS policies were created. Re-run the SQL from Step 3 |
