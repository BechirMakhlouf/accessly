-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ENUM for team roles
CREATE TYPE team_role AS ENUM ('admin', 'member');

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role team_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, team_id)
);

-- Enable RLS on teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow users to view teams they created
CREATE POLICY "Users can view their own team"
  ON teams FOR SELECT
  USING (auth.uid() = created_by);

-- Only admins can update the team
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

-- Only admins can delete the team
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

-- Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Trigger for auto-updating updated_at
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
