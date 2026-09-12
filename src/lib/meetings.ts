export type Meeting = {
  id: string;
  title: string;
  meeting_date: string;
  attendees: string | null;
  summary: string | null;
  decisions: string | null;
  created_at: string;
  updated_at: string;
};

export type NewMeetingInput = {
  title: string;
  meeting_date: string;
  attendees?: string;
  summary?: string;
  decisions?: string;
};
