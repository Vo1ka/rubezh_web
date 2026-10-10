-- RW-20: documents live in the repos; a registry entry points at the canonical
-- file instead of an uploaded copy. Format: `<repo>/<path>`, e.g.
-- `rubezh_full/docs/product/product-definition.md`. Existing rows keep their
-- external `url` and stay null here.
alter table public.documents add column if not exists source_path text;
