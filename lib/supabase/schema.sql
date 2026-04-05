-- ============================================================
-- Productivity Playbook — Database Schema
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CHARACTERS — Core game state
-- ============================================================
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT DEFAULT 'Warrior',
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  streak_freezes INT DEFAULT 2,
  phoenix_active BOOLEAN DEFAULT false,
  phoenix_days INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DAILY LOGS — One row per day, all habits + attributes + stats
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  habits JSONB DEFAULT '{}',
  attributes JSONB DEFAULT '{}',
  mrr NUMERIC,
  weight NUMERIC,
  body_fat NUMERIC,
  win_of_day TEXT,
  diet_score INT CHECK (diet_score IS NULL OR (diet_score >= 1 AND diet_score <= 5)),
  calories_est INT,
  niyyah TEXT,
  xp_earned INT DEFAULT 0,
  xp_breakdown JSONB DEFAULT '{}',
  streak_day INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- REVENUE BLOCKS — Hormozi revenue hours tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_min INT,
  description TEXT,
  category TEXT CHECK (category IN ('deep_work', 'sales', 'building', 'admin', 'other')),
  is_revenue BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- FOOD LOGS — Nutrition tracking (Gemini-assisted)
-- ============================================================
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  meal_label TEXT,
  food_name TEXT NOT NULL,
  calories INT,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SAVED MEALS — Quick re-logging
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  calories INT,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PRAYER LOGS — Fajr + Maghrib/Isha non-negotiable, all 5 optional
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  prayers JSONB DEFAULT '{}',
  fajr_done BOOLEAN DEFAULT false,
  second_prayer_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- LIFT SETS — One row per set, PR detection
-- ============================================================
CREATE TABLE IF NOT EXISTS lift_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  session_type TEXT,
  exercise TEXT NOT NULL,
  set_number INT,
  weight NUMERIC,
  reps INT,
  rpe NUMERIC,
  is_pr BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BODY COMP — AM/PM weight, body fat, 7-day averages
-- ============================================================
CREATE TABLE IF NOT EXISTS body_comp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  am_weight NUMERIC,
  pm_weight NUMERIC,
  body_fat NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- ACHIEVEMENTS — 50 badges
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  xp_awarded INT DEFAULT 0,
  UNIQUE(user_id, key)
);

-- ============================================================
-- GOALS — Hormozi reverse-engineering tree
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  deadline DATE,
  parent_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  goal_type TEXT DEFAULT 'goal' CHECK (goal_type IN ('goal', 'milestone', 'weekly_target', 'daily_action')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  lead_measure TEXT,
  lag_measure TEXT,
  position JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- NOTES — BlockNote documents for planning
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT DEFAULT 'Untitled',
  content JSONB DEFAULT '[]',
  parent_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  note_type TEXT DEFAULT 'page' CHECK (note_type IN ('page', 'daily_plan', 'weekly_review', 'brain_dump')),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- WEEKLY REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  week_start DATE NOT NULL,
  stats JSONB DEFAULT '{}',
  what_worked TEXT,
  what_didnt TEXT,
  next_focus TEXT,
  muhasaba TEXT,
  bonus_xp INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- ============================================================
-- WHOOP DATA CACHE
-- ============================================================
CREATE TABLE IF NOT EXISTS whoop_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  recovery_score NUMERIC,
  hrv NUMERIC,
  resting_hr NUMERIC,
  sleep_performance NUMERIC,
  strain NUMERIC,
  activities JSONB DEFAULT '[]',
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- WISDOM — Quran ayat & hadith pool (seeded separately)
-- ============================================================
CREATE TABLE IF NOT EXISTS wisdom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  source TEXT,
  category TEXT,
  triggers TEXT[]
);

-- ============================================================
-- NON-NEGOTIABLES CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS non_negotiables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY — Single user, enforce ownership
-- ============================================================
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lift_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_comp ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE whoop_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_negotiables ENABLE ROW LEVEL SECURITY;

-- Wisdom is public (read-only for all authenticated users)
ALTER TABLE wisdom ENABLE ROW LEVEL SECURITY;

-- RLS policies: user can only access their own data
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'characters', 'daily_logs', 'revenue_blocks', 'food_logs', 'saved_meals',
    'prayer_logs', 'lift_sets', 'body_comp', 'achievements', 'goals',
    'notes', 'weekly_reviews', 'whoop_data', 'non_negotiables'
  ])
  LOOP
    EXECUTE format('CREATE POLICY "Users can view own %1$s" ON %1$s FOR SELECT USING (auth.uid() = user_id)', tbl);
    EXECUTE format('CREATE POLICY "Users can insert own %1$s" ON %1$s FOR INSERT WITH CHECK (auth.uid() = user_id)', tbl);
    EXECUTE format('CREATE POLICY "Users can update own %1$s" ON %1$s FOR UPDATE USING (auth.uid() = user_id)', tbl);
    EXECUTE format('CREATE POLICY "Users can delete own %1$s" ON %1$s FOR DELETE USING (auth.uid() = user_id)', tbl);
  END LOOP;
END $$;

-- Wisdom: any authenticated user can read
CREATE POLICY "Authenticated users can read wisdom" ON wisdom FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_revenue_blocks_user_date ON revenue_blocks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_date ON prayer_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_lift_sets_user_date ON lift_sets(user_id, date);
CREATE INDEX IF NOT EXISTS idx_lift_sets_exercise ON lift_sets(user_id, exercise);
CREATE INDEX IF NOT EXISTS idx_body_comp_user_date ON body_comp(user_id, date);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_parent ON goals(parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_whoop_data_user_date ON whoop_data(user_id, date);

-- ============================================================
-- FUNCTION: Auto-create character on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.characters (user_id)
  VALUES (NEW.id);

  -- Insert default non-negotiables
  INSERT INTO public.non_negotiables (user_id, name, description, sort_order)
  VALUES
    (NEW.id, '6h Revenue Work', 'Minimum 6 hours of revenue-generating work', 1),
    (NEW.id, 'Fajr Prayer', 'Pray Fajr — no exceptions', 2),
    (NEW.id, 'Maghrib or Isha Prayer', 'Pray at least one evening prayer', 3);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: run on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
