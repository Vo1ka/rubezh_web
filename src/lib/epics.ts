import type { SectionSlug } from "./sections";

export const MVP_PRIORITIES = [
  { value: "P0", label: "P0 — критично" },
  { value: "P1", label: "P1 — важно" },
  { value: "P2", label: "P2 — желательно" },
] as const;

export type MvpPriority = (typeof MVP_PRIORITIES)[number]["value"];

export const EPIC_STATUSES = [
  { value: "not_started", label: "Не начат" },
  { value: "in_progress", label: "В работе" },
  { value: "blocked_design", label: "Заблокирован: дизайн" },
  { value: "blocked_technical", label: "Заблокирован: технически" },
  { value: "blocked_product", label: "Заблокирован: продукт" },
  { value: "needs_prototype", label: "Нужен прототип" },
  { value: "done", label: "Готово" },
] as const;

export type EpicStatus = (typeof EPIC_STATUSES)[number]["value"];

export const RISK_LEVELS = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number]["value"];

export type Epic = {
  id: string;
  title: string;
  description: string | null;
  owner_section: SectionSlug | null;
  mvp_priority: MvpPriority;
  status: EpicStatus;
  risk_level: RiskLevel | null;
  depends_on: string[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type NewEpicInput = {
  title: string;
  description?: string;
  owner_section?: SectionSlug | null;
  mvp_priority: MvpPriority;
  risk_level?: RiskLevel | null;
  depends_on: string[];
};
