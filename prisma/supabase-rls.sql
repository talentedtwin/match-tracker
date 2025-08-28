-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user ID from auth
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$;

-- Users table policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id::uuid);

-- Players table policies
-- Users can only see their own players
CREATE POLICY "Users can view own players" ON players
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own players" ON players
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own players" ON players
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own players" ON players
    FOR DELETE USING (auth.uid()::text = user_id);

-- Matches table policies
-- Users can only see their own matches
CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own matches" ON matches
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own matches" ON matches
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own matches" ON matches
    FOR DELETE USING (auth.uid()::text = user_id);

-- Player Match Stats table policies
-- Users can only see stats for their own matches and players
CREATE POLICY "Users can view own player match stats" ON player_match_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats.match_id
            AND m.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own player match stats" ON player_match_stats
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats.match_id
            AND m.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own player match stats" ON player_match_stats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats.match_id
            AND m.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own player match stats" ON player_match_stats
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats.match_id
            AND m.user_id = auth.uid()::text
        )
    );
