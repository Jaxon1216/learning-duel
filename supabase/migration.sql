-- ============================================================
-- Learning Study Room - Database Migration
-- Run this entire script in Supabase SQL Editor (one shot)
-- ============================================================

-- ① Drop old tables (from prototype phase)
DROP TABLE IF EXISTS learning_nodes CASCADE;
DROP TABLE IF EXISTS goals CASCADE;

-- ============================================================
-- ② Create new tables
-- ============================================================

-- profiles: user info card (name, education, bio, contact)
CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  education text,
  bio text,
  contact_type text,  -- wx / qq / github / email
  contact_value text,
  created_at timestamptz DEFAULT now()
);

-- goals: macro declarations ("雅思7分", "大厂Offer"), max 5 per user
CREATE TABLE goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title text NOT NULL,
  order_index int4 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- routes: learning route modules ("前端", "英语", "网工")
CREATE TABLE routes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name text NOT NULL,
  order_index int4 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- route_nodes: individual learning nodes within a route
CREATE TABLE route_nodes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  tag text,
  deadline timestamptz,
  completed boolean DEFAULT false,
  order_index int4 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ③ Enable RLS on all tables
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_nodes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ④ RLS Policies
--
-- Principle:
--   Everyone can SELECT (view all users' data)
--   Only the owner can INSERT / UPDATE / DELETE
-- ============================================================

-- ---- profiles ----
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE USING (auth.uid() = user_id);

-- ---- goals ----
CREATE POLICY "Anyone can view goals"
  ON goals FOR SELECT USING (true);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE USING (auth.uid() = user_id);

-- ---- routes ----
CREATE POLICY "Anyone can view routes"
  ON routes FOR SELECT USING (true);

CREATE POLICY "Users can insert own routes"
  ON routes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routes"
  ON routes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routes"
  ON routes FOR DELETE USING (auth.uid() = user_id);

-- ---- route_nodes ----
-- route_nodes don't have user_id directly; ownership is checked via the parent route
CREATE POLICY "Anyone can view route_nodes"
  ON route_nodes FOR SELECT USING (true);

CREATE POLICY "Users can insert nodes to own routes"
  ON route_nodes FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM routes WHERE routes.id = route_id AND routes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update nodes in own routes"
  ON route_nodes FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM routes WHERE routes.id = route_id AND routes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete nodes from own routes"
  ON route_nodes FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM routes WHERE routes.id = route_id AND routes.user_id = auth.uid()
    )
  );

-- ============================================================
-- ⑤ Auto-create profile on user signup (trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
