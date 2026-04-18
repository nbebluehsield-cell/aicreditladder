-- ============================================================================
-- Seed project types. Offers are seeded via `npm run seed:offers`
-- (src/scripts/seed-offers.ts) which reads `src/data/seed.ts` — keeping the
-- TypeScript file as the single source of truth for pre-launch authoring.
-- ============================================================================

insert into project_types (slug, label, description, position) values
  ('ai-coding-tool',      'AI coding tool',       'Copilots, code gen, dev agents',              1),
  ('chatbot',             'Chatbot / assistant',  'General-purpose conversational apps',         2),
  ('voice-app',           'Voice app',            'TTS, STT, realtime voice agents',             3),
  ('video-app',           'Video app',            'Video gen, editing, analysis',                4),
  ('image-app',           'Image app',            'Image gen, editing, vision',                  5),
  ('workflow-automation', 'Workflow automation',  'Automations, integrations, ops',              6),
  ('rag-app',             'RAG app',              'Retrieval-augmented apps on your data',       7),
  ('agent',               'Agent product',        'Multi-step autonomous agents',                8),
  ('b2b-internal',        'B2B internal AI',      'Internal productivity and knowledge tools',   9)
on conflict (slug) do update
  set label = excluded.label,
      description = excluded.description,
      position = excluded.position;
