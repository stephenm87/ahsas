-- =====================================================
-- AHSAS / Glopo Suite — Auth Database Setup
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hmdnzefzkfxjgufxsguq/sql/new
-- =====================================================

-- ── 1. Essays table (Glopo Companion) ─────────────────
CREATE TABLE IF NOT EXISTS essays (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question    TEXT,
    essay_text  TEXT,
    word_count  INTEGER,
    ao_scores   JSONB,   -- { ao1: 5, ao2: 4, ao3: 6, total: 15 }
    ai_feedback TEXT,
    site        TEXT DEFAULT 'companion',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Bookmarks table (all sites) ────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site        TEXT NOT NULL,  -- 'companion' | 'gcc' | 'ahsas'
    type        TEXT NOT NULL,  -- 'case' | 'event' | 'source' | 'news'
    title       TEXT NOT NULL,
    data        JSONB,          -- flexible: store the full object
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. CER submissions table (AHSAS) ──────────────────
CREATE TABLE IF NOT EXISTS cer_submissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    claim       TEXT,
    evidence    TEXT,
    reasoning   TEXT,
    ai_score    JSONB,          -- { score: 8, feedback: '...' }
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Enable Row Level Security on all tables ────────
ALTER TABLE essays           ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cer_submissions  ENABLE ROW LEVEL SECURITY;

-- ── 5. RLS Policies — users see only their own data ───

-- Essays
CREATE POLICY "Users can view own essays"
    ON essays FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essays"
    ON essays FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own essays"
    ON essays FOR DELETE
    USING (auth.uid() = user_id);

-- Bookmarks
CREATE POLICY "Users can view own bookmarks"
    ON bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
    ON bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
    ON bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- CER submissions
CREATE POLICY "Users can view own CERs"
    ON cer_submissions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CERs"
    ON cer_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own CERs"
    ON cer_submissions FOR DELETE
    USING (auth.uid() = user_id);

-- ── 6. Indexes for performance ────────────────────────
CREATE INDEX IF NOT EXISTS essays_user_id_idx          ON essays(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_user_id_site_idx  ON bookmarks(user_id, site);
CREATE INDEX IF NOT EXISTS cer_user_id_idx             ON cer_submissions(user_id);
