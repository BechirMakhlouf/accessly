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