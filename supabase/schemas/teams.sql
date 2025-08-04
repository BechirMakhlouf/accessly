-- 1. Create ENUM for team roles
CREATE TYPE team_role AS ENUM ('admin', 'member');

-- 2. Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY default gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role team_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, team_id)
);

-- 4. Create invites table (AFTER teams exists)
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invite_link TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for teams
CREATE POLICY "Users can view their own team"
  ON teams FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Only team admins can update team"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = auth.uid()
        AND team_members.team_id = teams.id
        AND team_members.role = 'admin'
    )
  );

CREATE POLICY "Only team admins can delete team"
  ON teams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = auth.uid()
        AND team_members.team_id = teams.id
        AND team_members.role = 'admin'
    )
  );

-- 7. RLS Policies for team_members
CREATE POLICY "Team members can view membership"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.team_id = team_members.team_id
    )
  );

CREATE POLICY "Admins can update team membership"
  ON team_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.team_id = team_members.team_id
        AND tm.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete team membership"
  ON team_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.team_id = team_members.team_id
        AND tm.role = 'admin'
    )
  );

-- 8. RLS Policies for invites
CREATE POLICY "Users can view invites they sent"
  ON invites FOR SELECT
  USING (auth.uid() = invited_by);

CREATE POLICY "Users can update invites they sent"
  ON invites FOR UPDATE
  USING (auth.uid() = invited_by);

-- 9. Triggers to update updated_at timestamp
CREATE TRIGGER handle_updated_at_teams
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_members
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_invites
BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
