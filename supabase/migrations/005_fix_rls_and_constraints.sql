-- ============================================================
-- Migration 005: disable RLS on all app tables + fix supplement constraint
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Disable Row Level Security on all tables
--    (personal app, no auth needed)
ALTER TABLE weight_logs         DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_completions    DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_weekly   DISABLE ROW LEVEL SECURITY;
ALTER TABLE ficha_completions   DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_weights    DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos     DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercises           DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets        DISABLE ROW LEVEL SECURITY;

-- 2. Expand supplement_weekly constraint to allow split hipercalórico
--    (migration 004 — idempotent if already applied)
ALTER TABLE supplement_weekly
  DROP CONSTRAINT IF EXISTS supplement_weekly_supplement_check;

ALTER TABLE supplement_weekly
  ADD CONSTRAINT supplement_weekly_supplement_check
  CHECK (supplement IN (
    'creatina',
    'whey',
    'hipercalorico',
    'hipercalorico_manha',
    'hipercalorico_noite',
    'hipercalorico_tarde'
  ));
