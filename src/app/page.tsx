import DashboardShell from "@/components/DashboardShell";
import RecentMeetings from "@/components/meetings/RecentMeetings";
import RoadmapHomeBlock from "@/components/roadmap/RoadmapHomeBlock";
import RecentNotesCard from "@/components/home/RecentNotesCard";
import ProjectProgressCard from "@/components/home/ProjectProgressCard";
import ActivityCard from "@/components/home/ActivityCard";

export default function Home() {
  return (
    <DashboardShell
      title="Дашборд команды"
      subtitle="Общий обзор хода разработки — сводка по всем направлениям."
      cta={{
        title: "Перейдите в специализированный раздел",
        description:
          "У каждого направления — свой дашборд: Анализ, Проект, Тестирование, Разработка, ТехЛид.",
        action: "Открыть разделы",
        href: "/sections",
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RecentNotesCard />
          <ProjectProgressCard />
          <ActivityCard />
        </div>
        <RoadmapHomeBlock />
        <RecentMeetings />
      </div>
    </DashboardShell>
  );
}
