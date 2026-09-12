import DashboardShell from "@/components/DashboardShell";

export default function ProjectPage() {
  return (
    <DashboardShell
      title="Проект"
      subtitle="Вехи, сроки и общий статус проекта."
      cards={[
        {
          title: "Ближайшие вехи",
          description: "Ключевые даты и цели текущего этапа.",
        },
        {
          title: "Статус задач",
          description: "Сколько задач сделано, в работе и запланировано.",
        },
        {
          title: "Риски и блокеры",
          description: "Что может помешать графику разработки.",
        },
      ]}
      cta={{
        title: "Обновите статус проекта",
        description: "Держите план и сроки в актуальном состоянии для всей команды.",
        action: "Обновить план",
      }}
    />
  );
}
