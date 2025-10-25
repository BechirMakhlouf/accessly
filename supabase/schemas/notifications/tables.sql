CREATE TYPE notification_type AS ENUM (
    'info',
    'warning'
); 

CREATE TYPE notification_status AS ENUM (
    'archived',
    'sent'
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    status notification_status NOT NULL DEFAULT 'sent',
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ NULL
);
