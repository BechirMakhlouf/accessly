CREATE TYPE accessable_type AS ENUM (
    'saas_app',
    'infrastructure',
    'database',
    'shared_credentials',
    'file_storage',
    'vpn',
    'physical',
    'custom'
);

CREATE TABLE IF NOT EXISTS public.accessables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type accessable_type NOT NULL,
    description TEXT,
    owner_user_id UUID REFERENCES profiles(id),
    url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);