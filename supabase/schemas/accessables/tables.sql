

CREATE TABLE IF NOT EXISTS public.accessables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES public.boards(id) ,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL default '',
    type TEXT NOT NULL default '',
    description TEXT,
    owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);