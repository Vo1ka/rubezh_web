import SectionPage from "@/components/SectionPage";
import RepoStatusWidget from "@/components/github/RepoStatusWidget";

export default function DevelopmentPage() {
  return (
    <SectionPage
      title="Разработка"
      subtitle="Текущая работа, ветки и последние изменения кода."
      section="development"
    >
      <RepoStatusWidget />
    </SectionPage>
  );
}
