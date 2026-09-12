import DashboardShell from "@/components/DashboardShell";

export default function DevelopmentPage() {
  return (
    <DashboardShell
      title="Разработка"
      subtitle="Текущая работа, ветки и последние изменения кода."
      cards={[
        {
          title: "В работе",
          description: "Задачи, над которыми сейчас идёт разработка.",
        },
        {
          title: "Последние изменения",
          description: "Свежие коммиты и обновления в репозитории.",
        },
        {
          title: "Техдолг",
          description: "Что стоит отрефакторить или доработать.",
        },
      ]}
      cta={{
        title: "Поделитесь статусом разработки",
        description: "Короткая заметка держит остальную команду в курсе прогресса.",
        action: "Добавить обновление",
      }}
    />
  );
}
