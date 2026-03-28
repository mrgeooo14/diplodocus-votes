-- Restrict resolution_content full-text to authenticated sessions (including anonymous).
-- The anon key alone sets auth.uid() = NULL → policy denies.
-- signInAnonymously() produces a real user UUID → policy allows.
-- All other tables remain on their existing "public read" policies.
DROP POLICY IF EXISTS "public read" ON resolution_content;

CREATE POLICY "auth read" ON resolution_content
  FOR SELECT USING (auth.uid() IS NOT NULL);
