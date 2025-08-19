-- 1. Create ENUM for organization roles
CREATE TYPE organization_role AS ENUM ('admin', 'member');

-- 2. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID NOT NULL PRIMARY KEY default gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_by UUID NOT NULL default auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, organization_id)
);

-- 4. Create invites table
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  invited_by UUID NOT NULL,
  invite_link TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for organizations
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Only organization admins can update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.user_id = auth.uid()
        AND organization_members.organization_id = organizations.id
        AND organization_members.role = 'admin'
    )
  );

CREATE POLICY "Only organization admins can delete organization"
  ON organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.user_id = auth.uid()
        AND organization_members.organization_id = organizations.id
        AND organization_members.role = 'admin'
    )
  );

-- 7. RLS Policies for organization_members
CREATE POLICY "organization members can view membership"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.organization_id = organization_members.organization_id
    )
  );

CREATE POLICY "Admins can update organization membership"
  ON organization_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.organization_id = organization_members.organization_id
        AND tm.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete organization membership"
  ON organization_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS tm
      WHERE tm.user_id = auth.uid()
        AND tm.organization_id = organization_members.organization_id
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
CREATE TRIGGER handle_updated_at_organizations
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_members
BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_invites
BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
