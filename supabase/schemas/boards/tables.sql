-- Enum for board visibility
CREATE TYPE boards_visibility AS ENUM ('public', 'private');
CREATE TYPE boards_role AS ENUM (
    'admin',
    'member');

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 2 AND 100),
    slug TEXT NOT NULL,
    UNIQUE (organization_id, slug),
    description TEXT,
    icon_url TEXT,
    visibility boards_visibility NOT NULL DEFAULT 'public',
    created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Board members table
CREATE TABLE IF NOT EXISTS board_members (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    role boards_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, board_id)
);

