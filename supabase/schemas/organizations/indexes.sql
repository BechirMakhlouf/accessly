-- organization_members
CREATE INDEX IF NOT EXISTS idx_om_org_user
    ON public.organization_members (organization_id, user_id);

-- Keep only if you need look‑ups by user_id alone
CREATE INDEX IF NOT EXISTS idx_om_user ON public.organization_members (user_id);

-- Partial index for admin checks (efficient for admin role queries)
CREATE INDEX IF NOT EXISTS idx_om_org_admin
    ON public.organization_members (organization_id, user_id)
    WHERE role = 'admin';

-- invites
CREATE INDEX IF NOT EXISTS idx_invites_org
    ON public.invites (organization_id);

CREATE INDEX IF NOT EXISTS idx_invites_email
    ON public.invites (email);   -- keep only if you query by email

CREATE INDEX IF NOT EXISTS idx_invites_invited_by
    ON public.invites (invited_by);
