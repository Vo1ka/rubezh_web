import DashboardShell from "@/components/DashboardShell";
import RecentMeetings from "@/components/meetings/RecentMeetings";
import RoadmapHomeBlock from "@/components/roadmap/RoadmapHomeBlock";

export default function Home() {
  return (
    <DashboardShell
      title="Дашборд команды"
      subtitle="Общий обзор хода разработки — сводка по всем направлениям."
      cards={[
        {
          title: "Последние заметки",
          description: "Свежие записи и обновления от участников команды.",
        },
        {
          title: "Прогресс по проекту",
          description: "Текущий статус задач и ближайшие вехи.",
        },
        {
          title: "Активность",
          description: "Последние изменения в анализе, тестировании и разработке.",
        },
      ]}
      cta={{
        title: "Перейдите в специализированный раздел",
        description:
          "У каждого направления — свой дашборд: Анализ, Проект, Тестирование, Разработка, ТехЛид.",
        action: "Открыть разделы",
        href: "/sections",
      }}
    >
      <div className="flex flex-col gap-6">
        <RoadmapHomeBlock />
        <RecentMeetings />
      </div>
    </DashboardShell>
  );
}
