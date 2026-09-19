import type { Owner } from "./owners";

// RW-1: a raw idea from a department — not yet an Epic (accepted into work)
// and not yet a Decisions record (an already-understood problem/blocker).
// Reuses the same status vocabulary style as Epic's 7-state cycle.
export const PROPOSAL_STATUSES = [
  { value: "new", label: "Новое" },
  { value: "validating", label: "На валидации" },
  { value: "approved", label: "Одобрено" },
  { value: "rejected", label: "Отклонено" },
  { value: "blocked_product", label: "Заблокирован: продукт" },
  { value: "blocked_design", label: "Заблокирован: дизайн" },
  { value: "blocked_technical", label: "Заблокирован: технически" },
  { value: "needs_prototype", label: "Нужен прототип" },
] as const;

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]["value"];

// RW-3: the validator agent's verdict vocabulary. The agent only ever
// writes to these fields — never to `status`.
export const VERDICTS = [
  { value: "aligned", label: "Aligned" },
  { value: "product_issue", label: "PRODUCT ISSUE" },
  { value: "design_issue", label: "DESIGN ISSUE" },
  { value: "technical_decision", label: "TECHNICAL DECISION" },
  { value: "needs_prototype", label: "NEEDS PROTOTYPE" },
  { value: "out_of_scope", label: "Вне MVP-скоупа" },
] as const;

export type Verdict = (typeof VERDICTS)[number]["value"];

export type ProposalRecord = {
  id: string;
  title: string;
  description: string | null;
  proposed_by: string | null;
  owner: Owner | null;
  epic_id: string | null;
  status: ProposalStatus;
  verdict: Verdict | null;
  verdict_rationale: string | null;
  verdict_references: string | null;
  verdict_owner: string | null;
  verdict_at: string | null;
  verdict_error: string | null;
  decision_id: string | null;
  source_note_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NewProposalInput = {
  title: string;
  description?: string;
  proposed_by?: string;
  owner?: Owner | null;
  epic_id?: string | null;
  source_note_id?: string | null;
};
