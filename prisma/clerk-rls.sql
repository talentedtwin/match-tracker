-- Row Level Security (RLS) policies for Clerk authentication
-- This file contains RLS policies that work with Clerk user IDs

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

DROP POLICY IF EXISTS "Users can view own players" ON players;
DROP POLICY IF EXISTS "Users can insert own players" ON players;
DROP POLICY IF EXISTS "Users can update own players" ON players;
DROP POLICY IF EXISTS "Users can delete own players" ON players;

DROP POLICY IF EXISTS "Users can view own matches" ON matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON matches;
DROP POLICY IF EXISTS "Users can update own matches" ON matches;
DROP POLICY IF EXISTS "Users can delete own matches" ON matches;

DROP POLICY IF EXISTS "Users can view own player match stats" ON player_match_stats;
DROP POLICY IF EXISTS "Users can insert own player match stats" ON player_match_stats;
DROP POLICY IF EXISTS "Users can update own player match stats" ON player_match_stats;
DROP POLICY IF EXISTS "Users can delete own player match stats" ON player_match_stats;

-- Create a function to get the current Clerk user ID
-- This assumes you'll set the current user ID in your application context
CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT nullif(current_setting('app.current_user_id', true), '');
$$;

-- Alternative: If using Supabase with Clerk integration, you might use:
-- CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS text
--     LANGUAGE sql STABLE
--     AS $$
--   SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '');
-- $$;

-- =============================================================================
-- USERS TABLE POLICIES
-- =============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = get_current_user_id());

-- Users can insert their own profile (for account creation)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (id = get_current_user_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = get_current_user_id());

-- Users can delete their own profile (soft deletion)
CREATE POLICY "Users can delete own profile" ON users
    FOR DELETE USING (id = get_current_user_id());

-- =============================================================================
-- PLAYERS TABLE POLICIES
-- =============================================================================

-- Users can view their own players (excluding soft-deleted ones by default)
CREATE POLICY "Users can view own players" ON players
    FOR SELECT USING (
        "userId" = get_current_user_id() 
        AND ("isDeleted" = false OR "isDeleted" IS NULL)
    );

-- Users can insert players for themselves
CREATE POLICY "Users can insert own players" ON players
    FOR INSERT WITH CHECK ("userId" = get_current_user_id());

-- Users can update their own players
CREATE POLICY "Users can update own players" ON players
    FOR UPDATE USING ("userId" = get_current_user_id());

-- Users can delete their own players (typically soft deletion)
CREATE POLICY "Users can delete own players" ON players
    FOR DELETE USING ("userId" = get_current_user_id());

-- =============================================================================
-- MATCHES TABLE POLICIES
-- =============================================================================

-- Users can view their own matches
CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING ("userId" = get_current_user_id());

-- Users can insert matches for themselves
CREATE POLICY "Users can insert own matches" ON matches
    FOR INSERT WITH CHECK ("userId" = get_current_user_id());

-- Users can update their own matches
CREATE POLICY "Users can update own matches" ON matches
    FOR UPDATE USING ("userId" = get_current_user_id());

-- Users can delete their own matches
CREATE POLICY "Users can delete own matches" ON matches
    FOR DELETE USING ("userId" = get_current_user_id());

-- =============================================================================
-- PLAYER_MATCH_STATS TABLE POLICIES
-- =============================================================================

-- Users can view player match stats for their own matches and players
CREATE POLICY "Users can view own player match stats" ON player_match_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats."matchId"
            AND m."userId" = get_current_user_id()
        )
        AND EXISTS (
            SELECT 1 FROM players p
            WHERE p.id = player_match_stats."playerId"
            AND p."userId" = get_current_user_id()
        )
    );

-- Users can insert player match stats for their own matches and players
CREATE POLICY "Users can insert own player match stats" ON player_match_stats
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats."matchId"
            AND m."userId" = get_current_user_id()
        )
        AND EXISTS (
            SELECT 1 FROM players p
            WHERE p.id = player_match_stats."playerId"
            AND p."userId" = get_current_user_id()
        )
    );

-- Users can update player match stats for their own matches and players
CREATE POLICY "Users can update own player match stats" ON player_match_stats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats."matchId"
            AND m."userId" = get_current_user_id()
        )
        AND EXISTS (
            SELECT 1 FROM players p
            WHERE p.id = player_match_stats."playerId"
            AND p."userId" = get_current_user_id()
        )
    );

-- Users can delete player match stats for their own matches and players
CREATE POLICY "Users can delete own player match stats" ON player_match_stats
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = player_match_stats."matchId"
            AND m."userId" = get_current_user_id()
        )
        AND EXISTS (
            SELECT 1 FROM players p
            WHERE p.id = player_match_stats."playerId"
            AND p."userId" = get_current_user_id()
        )
    );

-- =============================================================================
-- UTILITY FUNCTIONS FOR SETTING USER CONTEXT
-- =============================================================================

-- Function to set the current user ID in the database session
-- Call this from your application before making database queries
CREATE OR REPLACE FUNCTION set_current_user_id(user_id text) RETURNS void
    LANGUAGE sql
    AS $$
  SELECT set_config('app.current_user_id', user_id, true);
$$;

-- Example usage in your application:
-- Before making any database queries for a user, call:
-- SELECT set_current_user_id('clerk_user_id_here');

-- =============================================================================
-- GDPR COMPLIANCE ADDITIONS
-- =============================================================================

-- Policy to allow viewing soft-deleted data for GDPR export purposes
-- (you might want to add a special role or condition for this)
CREATE POLICY "Users can view own deleted data for GDPR" ON players
    FOR SELECT USING (
        "userId" = get_current_user_id() 
        AND "isDeleted" = true
        AND current_setting('app.gdpr_export_mode', true) = 'true'
    );

-- =============================================================================
-- TESTING QUERIES
-- =============================================================================

-- To test these policies, you can run:
-- 
-- 1. Set a user context:
-- SELECT set_current_user_id('your_clerk_user_id');
-- 
-- 2. Try queries:
-- SELECT * FROM users;     -- Should only show the current user
-- SELECT * FROM players;   -- Should only show the current user's players
-- SELECT * FROM matches;   -- Should only show the current user's matches
-- 
-- 3. Try with different user ID:
-- SELECT set_current_user_id('different_user_id');
-- SELECT * FROM players;   -- Should show different results or no results

-- =============================================================================
-- PERFORMANCE NOTES
-- =============================================================================

-- For better performance, consider adding indexes on userId columns:
-- CREATE INDEX CONCURRENTLY idx_players_user_id ON players("userId");
-- CREATE INDEX CONCURRENTLY idx_matches_user_id ON matches("userId");
-- CREATE INDEX CONCURRENTLY idx_players_user_deleted ON players("userId", "isDeleted");