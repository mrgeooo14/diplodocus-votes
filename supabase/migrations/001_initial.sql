-- DiploDocus initial schema
-- Designed to scale: multiple orgs, resolution content, entities, knowledge graph

-- Organizations (GA, SC, AU, EU, Arab League, etc.)
CREATE TABLE organizations (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  full_name TEXT
);

INSERT INTO organizations (id, name, full_name) VALUES
  ('GA', 'UNGA', 'United Nations General Assembly'),
  ('SC', 'UNSC', 'United Nations Security Council');

-- Resolutions
CREATE TABLE resolutions (
  id                 TEXT PRIMARY KEY,
  symbol             TEXT NOT NULL,
  org_id             TEXT NOT NULL REFERENCES organizations(id),
  year               INTEGER NOT NULL,
  date               DATE,
  session            TEXT,
  title              TEXT NOT NULL,
  total_yes          INTEGER NOT NULL DEFAULT 0,
  total_no           INTEGER NOT NULL DEFAULT 0,
  total_abstentions  INTEGER NOT NULL DEFAULT 0,
  total_non_voting   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX resolutions_org_year ON resolutions (org_id, year);
CREATE INDEX resolutions_year ON resolutions (year);

-- Per-country votes
CREATE TABLE votes (
  resolution_id TEXT NOT NULL REFERENCES resolutions(id) ON DELETE CASCADE,
  country_iso   TEXT NOT NULL,
  vote          CHAR(1) NOT NULL CHECK (vote IN ('Y','N','A','X')),
  PRIMARY KEY (resolution_id, country_iso)
);

CREATE INDEX votes_country ON votes (country_iso);

-- Subjects / topic tags
CREATE TABLE subjects (
  id    SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL
);

CREATE TABLE resolution_subjects (
  resolution_id TEXT NOT NULL REFERENCES resolutions(id) ON DELETE CASCADE,
  subject_id    INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (resolution_id, subject_id)
);

-- Full text content (sourced from UNGA_all.json / UNSC_all.json)
CREATE TABLE resolution_content (
  resolution_id TEXT PRIMARY KEY REFERENCES resolutions(id) ON DELETE CASCADE,
  full_text     TEXT,
  doc_id        TEXT    -- SHA256 from source corpus
);

-- Full-text search index on resolution titles and content
CREATE INDEX resolutions_title_fts ON resolutions USING gin(to_tsvector('english', title));
CREATE INDEX resolution_content_fts ON resolution_content USING gin(to_tsvector('english', coalesce(full_text, '')));

-- Entities (future: NER output — countries, orgs, people, treaties, concepts)
CREATE TABLE entities (
  id             SERIAL PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  type           TEXT CHECK (type IN ('country','organization','person','concept','treaty','other')),
  iso_code       TEXT,   -- ISO 3166-1 alpha-3 for country entities
  UNIQUE (canonical_name, type)
);

-- Entity mentions within resolution text (future: populated by NER pipeline)
CREATE TABLE entity_mentions (
  id            BIGSERIAL PRIMARY KEY,
  resolution_id TEXT NOT NULL REFERENCES resolutions(id) ON DELETE CASCADE,
  entity_id     INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  surface_form  TEXT,    -- exact text as it appeared
  context       TEXT,    -- surrounding sentence
  char_offset   INTEGER
);

CREATE INDEX entity_mentions_resolution ON entity_mentions (resolution_id);
CREATE INDEX entity_mentions_entity ON entity_mentions (entity_id);

-- Knowledge graph edges (future: co-mention relationships, curated links)
CREATE TABLE entity_relations (
  id               BIGSERIAL PRIMARY KEY,
  source_entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  target_entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  relation_type    TEXT NOT NULL,   -- 'sanctions','ally','member_of','condemns', etc.
  resolution_id    TEXT REFERENCES resolutions(id) ON DELETE SET NULL,
  year             INTEGER,
  confidence       REAL DEFAULT 1.0
);

CREATE INDEX entity_relations_source ON entity_relations (source_entity_id);
CREATE INDEX entity_relations_target ON entity_relations (target_entity_id);

-- Enable Row Level Security (anon key = read-only public access)
ALTER TABLE organizations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolutions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolution_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolution_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_mentions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_relations    ENABLE ROW LEVEL SECURITY;

-- Public read-only policies (SELECT only — no INSERT/UPDATE/DELETE policies are defined,
-- which means all write operations are denied by default for all roles via RLS).
CREATE POLICY "public read" ON organizations       FOR SELECT USING (true);
CREATE POLICY "public read" ON resolutions         FOR SELECT USING (true);
CREATE POLICY "public read" ON votes               FOR SELECT USING (true);
CREATE POLICY "public read" ON subjects            FOR SELECT USING (true);
CREATE POLICY "public read" ON resolution_subjects FOR SELECT USING (true);
CREATE POLICY "public read" ON resolution_content  FOR SELECT USING (true);
CREATE POLICY "public read" ON entities            FOR SELECT USING (true);
CREATE POLICY "public read" ON entity_mentions     FOR SELECT USING (true);
CREATE POLICY "public read" ON entity_relations    FOR SELECT USING (true);
