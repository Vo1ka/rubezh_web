export const DOC_KEY_PRESETS = [
  "product-definition",
  "epic-map",
  "game-design-spec",
  "technical-architecture",
] as const;

export type DocumentRecord = {
  id: string;
  doc_key: string;
  title: string;
  version: string;
  url: string;
  changelog: string | null;
  is_baseline: boolean;
  created_at: string;
};

export type NewDocumentInput = {
  doc_key: string;
  title: string;
  version: string;
  url: string;
  changelog?: string;
  is_baseline: boolean;
};
