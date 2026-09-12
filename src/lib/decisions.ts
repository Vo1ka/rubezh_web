export const RECORD_TYPES = [
  { value: "decision", label: "Решение" },
  { value: "risk", label: "Риск" },
  { value: "open_question", label: "Открытый вопрос" },
] as const;

export type RecordType = (typeof RECORD_TYPES)[number]["value"];

export const STATUS_OPTIONS: Record<RecordType, { value: string; label: string }[]> = {
  decision: [
    { value: "active", label: "Действует" },
    { value: "superseded", label: "Заменено" },
  ],
  risk: [
    { value: "open", label: "Открыт" },
    { value: "mitigated", label: "Снижен" },
    { value: "closed", label: "Закрыт" },
  ],
  open_question: [
    { value: "blocking", label: "Blocking" },
    { value: "needs_investigation", label: "Needs Investigation" },
    { value: "non_blocking", label: "Non-blocking" },
  ],
};

export type DecisionRecord = {
  id: string;
  type: RecordType;
  title: string;
  description: string | null;
  status: string | null;
  epic_id: string | null;
  related_ids: string[];
  created_at: string;
  updated_at: string;
};

export type NewDecisionInput = {
  type: RecordType;
  title: string;
  description?: string;
  status?: string;
  epic_id?: string | null;
  related_ids: string[];
};
