-- ============================================================
-- Bookmark Manager — Seed Data
-- Run this after database.sql to populate 5 sample bookmarks.
-- ============================================================

INSERT INTO bookmarks (url, title, tags) VALUES
  (
    'https://nextjs.org/docs',
    'Next.js Documentation',
    ARRAY['nextjs', 'react', 'frontend', 'docs']
  ),
  (
    'https://supabase.com/docs',
    'Supabase Documentation',
    ARRAY['supabase', 'postgres', 'backend', 'docs']
  ),
  (
    'https://tailwindcss.com/docs',
    'Tailwind CSS Documentation',
    ARRAY['tailwind', 'css', 'frontend', 'docs']
  ),
  (
    'https://www.typescriptlang.org/docs/',
    'TypeScript Official Handbook',
    ARRAY['typescript', 'javascript', 'docs', 'language']
  ),
  (
    'https://zod.dev',
    'Zod — TypeScript-first Schema Validation',
    ARRAY['zod', 'validation', 'typescript', 'library']
  );
