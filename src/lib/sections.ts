export const SECTIONS = [
  { slug: "analysis", label: "Анализ", href: "/analysis" },
  { slug: "project", label: "Проект", href: "/project" },
  { slug: "testing", label: "Тестирование", href: "/testing" },
  { slug: "development", label: "Разработка", href: "/development" },
  { slug: "techlead", label: "ТехЛид", href: "/techlead" },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export function getSectionBySlug(slug: string) {
  return SECTIONS.find((section) => section.slug === slug);
}
