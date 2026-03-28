-- Force RLS on all tables so the table owner (postgres / service role)
-- cannot bypass row-level security policies.
ALTER TABLE organizations       FORCE ROW LEVEL SECURITY;
ALTER TABLE resolutions         FORCE ROW LEVEL SECURITY;
ALTER TABLE votes               FORCE ROW LEVEL SECURITY;
ALTER TABLE subjects            FORCE ROW LEVEL SECURITY;
ALTER TABLE resolution_subjects FORCE ROW LEVEL SECURITY;
ALTER TABLE resolution_content  FORCE ROW LEVEL SECURITY;
ALTER TABLE entities            FORCE ROW LEVEL SECURITY;
ALTER TABLE entity_mentions     FORCE ROW LEVEL SECURITY;
ALTER TABLE entity_relations    FORCE ROW LEVEL SECURITY;
