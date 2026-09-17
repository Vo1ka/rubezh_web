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

export type PlaygroundComment = {
  id: string;
  note_id: string;
  content: string;
  author: string | null;
  created_at: string;
};

export type NewPlaygroundCommentInput = {
  content: string;
  author?: string;
};
