-- 1. Create more comprehensive ENUM for organization roles
CREATE TYPE organization_role AS ENUM (
    'admin',    -- Can manage members, settings
    'member',   -- Standard access
    'owner'
);

-- 2. Create organizations table with additional constraints and fields
CREATE TABLE IF NOT EXISTS organizations (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
    description TEXT,
    icon_url TEXT,
    created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create organization_members table with more comprehensive tracking
CREATE TABLE IF NOT EXISTS organization_members (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role organization_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, organization_id)
);

-- 4. Enhanced invites table with status and expiration logic
CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    invite_token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    role organization_role NOT NULL DEFAULT 'member',
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create an index for performance optimization
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_invites_organization_id ON invites(organization_id);
CREATE INDEX idx_invites_email ON invites(email);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for organizations
CREATE POLICY "Users can view organizations they are members of"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id 
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners and admins can update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id 
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id 
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Only organization owners can delete organization"
  ON organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id 
        AND om.user_id = auth.uid()
        AND om.role = 'owner'
    )
  );

-- 8. RLS Policies for organization_members
CREATE POLICY "Members can view their organization's members"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id 
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and owners can manage membership"
  ON organization_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id 
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    -- Prevent demoting the last owner
    NOT (
      organization_members.role = 'owner' 
      AND (
        SELECT COUNT(*) 
        FROM organization_members 
        WHERE organization_id = organization_members.organization_id 
          AND role = 'owner'
      ) <= 1
    )
  );

-- 9. RLS Policies for invites
CREATE POLICY "Users can create invites for their organizations"
  ON invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = invites.organization_id 
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view invites for their organizations"
  ON invites FOR SELECT
  USING (
    auth.uid() = invited_by 
    OR 
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = invites.organization_id 
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );

-- 10. Triggers to update timestamps (assuming moddatetime extension is installed)
CREATE TRIGGER handle_updated_at_organizations
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_members
BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_invites
BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
