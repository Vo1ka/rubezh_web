import { SECTIONS } from "./sections";

// RW-2: owner vocabulary for Epic/Proposal/Decision — the five discipline
// Kanban sections plus real accountable roles that don't have a board of
// their own. Kept separate from SectionSlug because these roles have no
// /href to navigate to.
export const ROLE_OWNERS = [
  { value: "founder", label: "Founder" },
  { value: "game_design", label: "Game Design" },
  { value: "product_manager", label: "Product Manager" },
  { value: "product_lead", label: "Product Lead" },
] as const;

export const OWNERS = [
  ...SECTIONS.map((s) => ({ value: s.slug, label: s.label })),
  ...ROLE_OWNERS,
] as const;

export type Owner = (typeof OWNERS)[number]["value"];

export function ownerLabel(owner: string | null | undefined) {
  return OWNERS.find((o) => o.value === owner)?.label;
}
