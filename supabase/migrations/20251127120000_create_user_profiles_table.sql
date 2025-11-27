-- migration: create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  gender text,
  age integer,
  height integer,
  weight integer,
  skin_type text,
  body_type text,
  style_preferences jsonb DEFAULT '[]',
  recommendation_preferences jsonb DEFAULT '[]',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles" ON user_profiles FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert profiles" ON user_profiles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON user_profiles FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
