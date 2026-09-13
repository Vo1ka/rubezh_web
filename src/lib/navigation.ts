import { SECTIONS } from "./sections";

export const NAV_TABS = [
  {
    href: "/",
    label: "Главная",
    description:
      "Дашборд команды: карточки заметок и прогресса, лента последних встреч, переход в разделы.",
  },
  {
    href: "/epics",
    label: "Epic Map",
    description:
      "12 Epic'ов MVP с приоритетом, статусом, риском и зависимостями. Клик по Epic открывает карточку с подробным описанием и связанными решениями.",
  },
  {
    href: "/decisions",
    label: "Решения",
    description:
      "Решения, риски и открытые вопросы — привязаны к Epic'ам и друг к другу, живут отдельно от конкретной встречи.",
  },
  {
    href: "/documents",
    label: "Документы",
    description:
      "Реестр версий ключевых документов (Product Definition, Epic Map, Technical Architecture) со ссылками на актуальные версии.",
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    description:
      "Вехи интеграции, рекомендованный порядок работ и текущий спринт — из Development Plan.",
  },
  {
    href: "/marketing-assessment",
    label: "Маркетинг",
    description:
      "Независимая маркетинговая оценка проекта на основе Product Definition v4: позиционирование, риски, рекомендации по срокам коммуникации.",
  },
  {
    href: "/meetings",
    label: "Встречи",
    description: "Лог встреч: тема, дата, участники, обсуждение, итоговые решения.",
  },
  ...SECTIONS,
] as const;
