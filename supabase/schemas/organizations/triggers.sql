CREATE TRIGGER handle_updated_at_organizations
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_members
BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_invites
BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Revoke execution of the helper function from regular roles (so only the trigger can call it)
REVOKE EXECUTE ON FUNCTION public.add_creator_to_organization() FROM anon, authenticated;

-- Trigger to run after a new organization is inserted
CREATE TRIGGER trg_add_creator_to_organization
AFTER INSERT ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_to_organization();
