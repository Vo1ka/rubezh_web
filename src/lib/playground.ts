export type PlaygroundNote = {
  id: string;
  content: string;
  author: string | null;
  created_at: string;
  updated_at: string;
};

export type NewPlaygroundNoteInput = {
  content: string;
  author?: string;
};
