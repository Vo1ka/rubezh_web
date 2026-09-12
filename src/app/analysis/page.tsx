import DashboardShell from "@/components/DashboardShell";

export default function AnalysisPage() {
  return (
    <DashboardShell
      title="Анализ"
      subtitle="Исследования, требования и решения по анализу проекта."
      cards={[
        {
          title: "Открытые вопросы",
          description: "Требования и гипотезы, ожидающие решения.",
        },
        {
          title: "Заметки анализа",
          description: "Последние выводы и материалы по исследованию.",
        },
        {
          title: "Связанные задачи",
          description: "Как анализ влияет на текущий бэклог.",
        },
      ]}
      cta={{
        title: "Добавьте новую заметку по анализу",
        description: "Фиксируйте выводы, чтобы вся команда видела актуальную картину.",
        action: "Новая заметка",
      }}
    />
  );
}
