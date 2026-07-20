-- SQL Schema for Wild Gaming Cafe

-- 1. Games Table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  platform TEXT NOT NULL,
  image_url TEXT NOT NULL,
  players TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_pool TEXT,
  game TEXT,
  status TEXT DEFAULT 'Upcoming',
  image_url TEXT,
  description TEXT,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Read Policies (Allows anyone to view the data)
CREATE POLICY "Allow public read access on games" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);

-- 6. Create Admin Write Policies (Assuming anon key for now, you should lock this down with Supabase Auth later)
CREATE POLICY "Allow anon insert/update/delete on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow anon insert/update/delete on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow anon insert/update/delete on gallery" ON gallery FOR ALL USING (true);
