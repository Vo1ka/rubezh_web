import DashboardShell from "@/components/DashboardShell";

export default function TestingPage() {
  return (
    <DashboardShell
      title="Тестирование"
      subtitle="Покрытие тестами, найденные баги и статус прогонов."
      cards={[
        {
          title: "Найденные баги",
          description: "Открытые дефекты, требующие внимания.",
        },
        {
          title: "Прогоны тестов",
          description: "Результаты последних прогонов и покрытие.",
        },
        {
          title: "План тестирования",
          description: "Что предстоит проверить в ближайшее время.",
        },
      ]}
      cta={{
        title: "Зафиксируйте результаты тестирования",
        description: "Актуальные заметки помогают разработке быстрее закрывать баги.",
        action: "Добавить отчёт",
      }}
    />
  );
}
