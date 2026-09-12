import DashboardShell from "@/components/DashboardShell";

export default function TechLeadPage() {
  return (
    <DashboardShell
      title="ТехЛид"
      subtitle="Архитектурные решения, ревью и общее состояние технической базы."
      cards={[
        {
          title: "Архитектурные решения",
          description: "Ключевые решения и их обоснование.",
        },
        {
          title: "Ревью и стандарты",
          description: "Открытые ревью и договорённости по качеству кода.",
        },
        {
          title: "Состояние инфраструктуры",
          description: "Деплой, окружения и зависимости проекта.",
        },
      ]}
      cta={{
        title: "Зафиксируйте архитектурное решение",
        description: "Явные решения экономят время всей команде в будущем.",
        action: "Новая заметка",
      }}
    />
  );
}
