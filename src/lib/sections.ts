export const SECTIONS = [
  {
    slug: "analysis",
    label: "Анализ",
    href: "/analysis",
    description: "Kanban-доска дисциплины: Бэклог / В работе / Ревью / Готово.",
  },
  {
    slug: "project",
    label: "Проект",
    href: "/project",
    description: "Kanban-доска дисциплины: Бэклог / В работе / Ревью / Готово.",
  },
  {
    slug: "testing",
    label: "Тестирование",
    href: "/testing",
    description: "Kanban-доска дисциплины: Бэклог / В работе / Ревью / Готово.",
  },
  {
    slug: "development",
    label: "Разработка",
    href: "/development",
    description:
      "Kanban-доска дисциплины плюс виджет GitHub-репозитория (ветка, последний коммит).",
  },
  {
    slug: "techlead",
    label: "ТехЛид",
    href: "/techlead",
    description: "Kanban-доска дисциплины: Бэклог / В работе / Ревью / Готово.",
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export function getSectionBySlug(slug: string) {
  return SECTIONS.find((section) => section.slug === slug);
}
