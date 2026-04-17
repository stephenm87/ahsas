-- ================================================================
--  AHSAS — Supabase Row Level Security (RLS) Migration
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  What this does:
--    1. Enables RLS on the user_data table
--    2. Adds policies so users can ONLY see/edit their own rows
--    3. After this runs, the SERVICE_ROLE_KEY is no longer needed
-- ================================================================

-- Step 1: Enable RLS on the table
-- (currently any authenticated user can read ANY row)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Step 2: SELECT — users can only read their own rows
CREATE POLICY "users_select_own_data"
  ON user_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Step 3: INSERT — users can only insert rows with their own user_id
CREATE POLICY "users_insert_own_data"
  ON user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 4: UPDATE — users can only update their own rows
CREATE POLICY "users_update_own_data"
  ON user_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 5: DELETE — users can only delete their own rows
CREATE POLICY "users_delete_own_data"
  ON user_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── Verify it worked ──────────────────────────────────────────
-- Run this after applying the policies:
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_data';
-- rowsecurity should be TRUE

SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'user_data';
-- Should show 4 policies
