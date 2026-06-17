-- ============================================
-- CONTACT SIGNALS TABLE — Supabase SQL Editor
-- Paste this entire file into SQL Editor → Run
-- ============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS contact_signals (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT DEFAULT 'Direct Portfolio Inquiry',
  message    TEXT NOT NULL
);

-- 2. Add a comment so you remember what this is
COMMENT ON TABLE contact_signals IS 'Stores contact form submissions from the portfolio site.';

-- 3. Enable Row Level Security (required by Supabase)
ALTER TABLE contact_signals ENABLE ROW LEVEL SECURITY;

-- 4. Allow anonymous visitors to INSERT (submit the form)
CREATE POLICY "Allow anonymous inserts"
  ON contact_signals
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Only authenticated / service-role can READ the messages
CREATE POLICY "Allow authenticated reads"
  ON contact_signals
  FOR SELECT
  TO authenticated
  USING (true);
