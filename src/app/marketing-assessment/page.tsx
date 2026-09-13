import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-article",
});

export const metadata: Metadata = {
  title: "Рыночная оценка — Rubezh",
  description:
    "Market Intelligence & Growth Strategy Report: конкурентный ландшафт, PMF-разрывы, риски и growth-стратегия для Rubezh, на основе Product Definition v4 и исследования рынка CurseForge/Modrinth (сентябрь 2026).",
};

const h2 = "mt-14 scroll-mt-6 text-[26px] font-semibold text-[var(--color-title)]";
const h3 = "mt-8 text-[20px] font-semibold text-[var(--color-title)]";
const p = "mt-4 text-[18px] leading-[1.85] text-[var(--color-secondary-text)]";
const ul = "mt-4 flex flex-col gap-3 text-[18px] leading-[1.75] text-[var(--color-secondary-text)]";
const li =
  "flex gap-3 before:mt-[11px] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--color-forest-600)]";

function Callout({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      className="mt-6 rounded-lg border p-5"
      style={{ borderColor: "var(--color-secondary-border)", background: "var(--color-secondary-bg)" }}
    >
      {label ? (
        <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-body)]">
          {label}
        </p>
      ) : null}
      <div className="mt-2 text-[18px] leading-[1.8] text-[var(--color-secondary-text)]">
        {children}
      </div>
    </div>
  );
}

function DataTable({
  head,
  rows,
  minWidth = 640,
}: {
  head: string[];
  rows: ReactNode[][];
  minWidth?: number;
}) {
  return (
    <div
      className="mt-4 overflow-x-auto rounded-lg border"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <table
        className="w-full border-collapse text-left text-[15px]"
        style={{ minWidth: `${minWidth}px` }}
      >
        <thead>
          <tr style={{ background: "var(--color-surface-bg)" }}>
            {head.map((h) => (
              <th key={h} className="p-3 align-bottom font-semibold text-[var(--color-title)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t align-top" style={{ borderColor: "var(--color-surface-border)" }}>
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-[var(--color-secondary-text)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOC: [string, string][] = [
  ["executive-verdict", "0. Executive Verdict"],
  ["key-questions", "1. Ответы на ключевые вопросы"],
  ["competitive-landscape", "2. Конкурентный ландшафт"],
  ["install-triggers", "3. Install-триггеры"],
  ["pain-points", "4. Community Pain Points"],
  ["desires", "5. Community Desires"],
  ["demand-drivers", "6. Demand Driver Matrix"],
  ["pmf-gaps", "7. PMF: разрывы"],
  ["differentiation-audit", "8. Дифференциация: аудит"],
  ["market-mvp", "9. Market-Critical MVP"],
  ["gap-analysis", "10. Competitive Gap Analysis"],
  ["opportunity-map", "11. Opportunity Map"],
  ["risks", "12. Ключевые риски"],
  ["monetization", "13. Монетизация"],
  ["hypotheses", "14. Рыночные гипотезы"],
  ["growth-strategy", "15. Growth Strategy"],
  ["pd-audit", "16. Аудит Product Definition v4"],
  ["final-answer", "17. Итоговый ответ"],
  ["update-prominence", "18. Обновление: Prominence II"],
];

const keyQuestions: { q: string; a: ReactNode }[] = [
  {
    q: "1. Для кого существует продукт?",
    a: "Формально — для 16+ игроков, знакомых с souls-like и модовыми RPG-сборками (Assumption в самом документе). Фактически такая аудитория на CurseForge уже полностью охвачена DawnCraft и его клонами; часть этой аудитории уже «прошла» через DawnCraft и либо (а) осталась голодной до чего-то лучше, либо (б) выгорела на самой идее «Elden Ring в Minecraft» после разочарования. Rubezh целится в подмножество (а), но документ этого явно не формулирует и не отделяет от (б).",
  },
  {
    q: "2. Какая проблема решается?",
    a: "Реальная и подтверждаемая: игроки действительно жалуются на «vanilla+урон»-бой в RPG-паках и на то, что боевые/loot-системы декоративны. Это EVIDENCE, а не гипотеза — см. раздел 9.",
  },
  {
    q: "3. Почему игрок должен установить его?",
    a: "Слабое место MVP: нет ответа, который отличался бы от ответа DawnCraft/EldenCraft при первом клике «Install» — тот же питч («Elden Ring в Minecraft»), тот же визуальный референс. Установочный крючок пока не сформулирован сильнее, чем у конкурентов с миллионами загрузок.",
  },
  {
    q: "4. Почему игрок должен продолжить играть?",
    a: "Потенциально — да, если лор и environmental storytelling реально затянут за пределы combat-новизны (см. H7). Но это WEAK / UNVALIDATED: ни одного плейтеста ещё не было.",
  },
  {
    q: "5. Почему выбрать его вместо конкурентов?",
    a: "Единственный правдоподобный ответ — сочетание «без уворота» + «выживание не декоративно» + «лор уровня Elden Ring». Первое — риск, не преимущество, пока не проверено. Второе легко копируется (это функция балансировки production-цепочек, не техническая инновация). Третье — самый сильный кандидат, но требует нарративного дизайна, которого пока нет.",
  },
  {
    q: "6. Главный demand driver?",
    a: "Ностальгия/фантазия «почувствовать Elden Ring, но в песочнице, которую можно менять» — подтверждённый спрос (DawnCraft, десятки клонов). Это не уникальный для Rubezh драйвер — это драйвер всей ниши.",
  },
  {
    q: "7. Что может помешать adoption?",
    a: "(а) Ниша визуально/концептуально неотличима от уже известных паков на скриншотах/трейлере; (б) волонтёрская команда без объёма контента, сравнимого с 200+ модами DawnCraft; (в) отсутствие сервера/мультиплеера с первого дня — но большинство конкурентов как раз про совместный сервер/SMP, что было органическим двигателем их роста (см. раздел 6).",
  },
  {
    q: "8. Что может привести к retention?",
    a: "Лор + системное выживание, если они реально работают как петля, а не текстовая обёртка. Технически untested.",
  },
  {
    q: "9. Что может привести к organic growth?",
    a: "YouTube/Twitch-контент на «новый souls-like modpack» — но это тот же канал, что и у DawnCraft; без явно иного визуального языка или «hook»-момента ролик просто сольётся с десятком похожих видео.",
  },
  {
    q: "10. Есть ли потенциальная коммерческая модель?",
    a: "Да, но только сервер+cosmetics после подтверждённого retention — сама Product Definition уже сузила её правильно (см. раздел 13).",
  },
  {
    q: "11. Сильные элементы?",
    a: "Лор-пилар (уникален относительно всех найденных конкурентов), явный отказ от копирования модлиста, дисциплина MVP-объёма, честная фиксация рисков в самом документе.",
  },
  {
    q: "12. Слабые/недоказанные элементы?",
    a: "Полностью кастомная боевая система и кастомные мобы как обязательное MUST HAVE — при наличии бесплатных зрелых альтернатив это самый дорогой путь к тому же результату, который рынок уже видел; H1/H8 непроверены; демографическая гипотеза «у нас будет другая аудитория, чем у DawnCraft» не сформулирована и не тестируется.",
  },
];

const pmfSteps: { label: string; note: string }[] = [
  {
    label: "Target Audience (souls-like/RPG-паки, 16+)",
    note: "✓ совпадает с существующим, но уже насыщенным сегментом",
  },
  {
    label: "Player Need (тяжёлый бой + небутафорское выживание)",
    note: "✓ реальна, ⚠ но «тяжёлый бой» уже закрыт Epic Fight бесплатно",
  },
  {
    label: "Product Promise («каждый бой — испытание, тайминг решает»)",
    note: "⚠ идентична промису DawnCraft/EldenCraft-клонов слово в слово по духу",
  },
  {
    label: "Core Experience (исследование + бой без уворота + выживание + лор)",
    note: "⚠ разрыв: рынок хочет ПРОВЕРЕННЫЙ souls-фидбэк (дожд-ролл), продукт сознательно его убирает",
  },
  {
    label: "Core Loop",
    note: "✓ структурно похож на успешные аналоги (лут → крафт → сложнее вызов)",
  },
  {
    label: "Differentiation (лор + выживание + без уворота)",
    note: "⚠ 2 из 3 осей дифференциации (лор, выживание) не проверены; 3-я (без уворота) — контр-рыночная ставка",
  },
  {
    label: "Market Demand",
    note: "✗ разрыв: рынок явно голосует деньгами и загрузками за Epic Fight-подобный дожд-ролл боёвку — продукт идёт против этого сигнала",
  },
];

export default function MarketingAssessmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-[var(--color-body)] hover:underline">
        ← Главная
      </Link>

      <article className={`${montserrat.variable} mt-6`} style={{ fontFamily: "var(--font-article)" }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]/70">
          Market Intelligence &amp; Growth Strategy Report
        </p>
        <h1 className="mt-2 text-[36px] font-bold leading-tight text-[var(--color-title)]">
          Rubezh — независимая рыночная оценка
        </h1>
        <p className={p}>
          На основе Product Definition v4 (12.09.2026) и внешнего исследования CurseForge/Modrinth-рынка
          Minecraft, сентябрь 2026. Отчёт сопоставляет заявленную дифференциацию продукта с реальным
          конкурентным ландшафтом ниши «Elden Ring в Minecraft» — кто в ней уже есть, чем реально недовольны
          игроки и что из этого означает для MVP-плана.
        </p>

        <div
          className="mt-8 rounded-lg border p-5"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Содержание
          </p>
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {TOC.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-[15px] text-[var(--color-secondary-text)] hover:underline"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* 0. Executive Verdict */}
        <h2 id="executive-verdict" className={h2}>
          0. Executive Verdict
        </h2>
        <Callout>
          <strong>
            Короткий ответ на главный вопрос: рыночное предложение Rubezh в текущей формулировке — не слабое
            по амбиции, но крайне рискованное по дифференциации, потому что оно метит в самую насыщенную и уже
            занятую нишу Minecraft-модскейпа: «Elden Ring внутри Minecraft».
          </strong>
        </Callout>
        <p className={p}>
          Это не гипотетическая ниша — это существующая, плотно заселённая категория с явным лидером
          (DawnCraft, ~10,3 млн загрузок), десятком-двумя менее успешных клонов («EldenCraft», «Elden
          Adventure», «Elder Rings», «Souls-Like», «SULS», «AetherFall», «DeepRing», «The Dawn of a New Day» и
          т.д.) и де-факто отраслевым стандартом боевого фреймворка (<strong>Epic Fight</strong>, souls-like
          боёвка со стаминой, пойзом, уворотом, weapon arts — свободно доступна, официально портирована на
          NeoForge 1.21.1, используется в подавляющем большинстве этих паков), а также стандартным mob/boss-
          контент-модом (<strong>L_Ender&apos;s Cataclysm</strong>, 14,8 млн загрузок, тоже уже на NeoForge
          1.21.1).
        </p>
        <p className={p}>
          Это меняет саму рамку вопроса. Rubezh конкурирует не с «жанром вообще», а с конкретными,
          бесплатными, уже существующими строительными блоками, которые команда сознательно решила не
          использовать (или использует лишь частично) и переизобрести с нуля. Это не делает продукт
          нежизнеспособным — но означает, что{" "}
          <strong>
            объём разработки, который команда планирует потратить на кастомную боёвку и кастомных мобов, — это
            прямая инвестиция в то, чтобы конкурировать с бесплатной, зрелой альтернативой, а не в то, чтобы
            избежать конкуренции
          </strong>
          . Ставка оправдана только если результат ощутимо лучше или ощутимо иначе, чем Epic Fight/Cataclysm —
          а это ровно то, что непроверенные гипотезы H1/H8 должны доказать.
        </p>
        <p className={p}>
          Второй момент, требующий честной оценки:{" "}
          <strong>
            отказ от i-frame-уворота — это отказ именно от того элемента, который целевая аудитория этой ниши
            уже выбрала руками
          </strong>
          . Каждый выявленный конкурент (DawnCraft, EldenCraft-клоны, «Souls-Like», «SULS») построен вокруг
          Epic Fight именно из-за уворота/стамины/пойза как узнаваемого «как в Elden Ring» ощущения. Reddit- и
          review-данные по DawnCraft показывают, что даже там, где уворот есть, он остаётся предметом жалоб
          (поздно открывается, плохо объяснён) — но никто из аналогов не пробовал убрать его совсем. Rubezh
          будет первым, кто тестирует это на практике в этой нише. Это либо сильный дифференциатор (осознанная
          развилка, как и написано в документе), либо повод для аудитории сказать «это не Elden Ring, это
          недоделанный souls-like» — ровно тот риск, который сам документ называет главным (H1/H8).
        </p>
        <Callout label="Вывод">
          Продукт может быть конкурентоспособен — но не благодаря объёму кастомного контента (тут DawnCraft и
          Cataclysm-паки уже переиграли рынок количеством), а только если лор/нарратив-столп (единственная
          ось, где ни один прямой конкурент не инвестирует всерьёз) реально станет ощутимым дифференциатором
          уже в MVP, и если боевая система без уворота будет протестирована на реальных игроках до того, как
          под неё построят контент.
        </Callout>

        {/* 1. Key questions */}
        <h2 id="key-questions" className={h2}>
          1. Ответы на ключевые вопросы
        </h2>
        <div className="mt-2 flex flex-col divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
          {keyQuestions.map((item) => (
            <div key={item.q} className="py-4">
              <p className="text-[18px] font-semibold text-[var(--color-title)]">{item.q}</p>
              <p className="mt-2 text-[17px] leading-[1.8] text-[var(--color-secondary-text)]">{item.a}</p>
            </div>
          ))}
        </div>

        {/* 2. Competitive landscape */}
        <h2 id="competitive-landscape" className={h2}>
          2. Конкурентный ландшафт
        </h2>

        <h3 className={h3}>2.1 Прямые конкуренты (тот же жанр/фэнтези/бой/аудитория)</h3>
        <DataTable
          head={["Продукт", "Загрузки/охват", "Платформа", "Позиционирование"]}
          minWidth={760}
          rows={[
            [
              <strong key="a">DawnCraft — Echoes of Legends</strong>,
              "~10,3 млн (CurseForge)",
              "Forge 1.18.2",
              "Лидер ниши: souls-like RPG, кастомный квестлайн, боссы, репутация фракций, 200+ модов на базе Epic Fight",
            ],
            [
              <strong key="b">L_Ender&apos;s Cataclysm</strong>,
              "14,8 млн",
              "Forge/NeoForge, уже на 1.21.1",
              "Готовые dark-fantasy боссы/подземелья/лут — то, что Rubezh хочет строить с нуля (мод, не пак, но фактический стандарт)",
            ],
            [
              "EldenCraft / Elden Adventure / Elder Rings / «Souls-Like» / SULS / DeepRing / «The Dawn of a New Day» (десяток+ паков)",
              "от ~1 тыс. до ~19 тыс. загрузок каждый",
              "преимущественно Forge 1.16–1.20",
              "Прямые нишевые клоны идеи «Elden Ring в Minecraft», почти все на связке Epic Fight + Cataclysm + Mowzie's Mobs/Ice&Fire",
            ],
            [
              "Vault Hunters (3rd Ed / Remastered)",
              "5,5 млн+",
              "Forge 1.18.2",
              "RPG-прогрессия, талант-система, боссы, но тема dungeon-crawler, не souls-like combat — частично пересекается по аудитории «хочу RPG-Minecraft»",
            ],
            [
              "Cisco's Fantasy Medieval RPG, Prominence II",
              "заметные, входят в топ-10 паков 2026",
              "1.19.2 Forge / 1.20.1 Fabric",
              "Сюжетно-ориентированные medieval-RPG паки — прямой конкурент по лор-осям",
            ],
          ]}
        />
        <p className={p}>
          <strong>Вывод по прямым конкурентам:</strong> ни один крупный игрок ещё не перешёл на NeoForge
          1.21.1 (весь топ RPG-ниши сидит на 1.18.2–1.20.1). Это даёт Rubezh временное окно «первым на новой
          платформе» — но одновременно объясняет, почему экосистема (Ad Astra, часть контентных аддонов) там
          ещё не дозрела.
        </p>

        <h3 className={h3}>2.2 Косвенные конкуренты (другая механика, та же потребность)</h3>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Epic Fight + Cataclysm + произвольный набор мобов</strong>, собранные игроком/малой
              командой самостоятельно как «личный» модпак — прямая угроза для тезиса «нужен полностью кастомный
              движок», потому что даёт 80% ощущения за 5% трудозатрат.
            </span>
          </li>
          <li className={li}>
            Souls-like инди-игры вне Minecraft — не самая близкая угроза за внимание, но конкурирует за тот же
            психографический сегмент «хочу тяжёлый тайминг-бой».
          </li>
          <li className={li}>
            RLCraft / GT New Horizons и другие hardcore-survival паки — конкурируют за аудиторию «хочу, чтобы
            выживание было настоящим», не за souls-combat аудиторию, но пересечение по ценности «система, а не
            декорация» есть.
          </li>
        </ul>

        <h3 className={h3}>2.3 Attention-конкуренты</h3>
        <p className={p}>
          Любой активно обновляемый топовый пак (All the Mods 10, Better MC BMC5, Cobblemon) — конкурирует не
          за жанр, а за ограниченный «модпак-слот» игрока и, что важнее, за внимание модпак-ютуберов, которые
          формируют почти весь органический трафик CurseForge.
        </p>

        <h3 className={h3}>2.4 Конкурентная матрица (сокращённая)</h3>
        <DataTable
          head={["Продукт", "Аудитория", "Core Loop", "USP", "Популярность", "Монетизация", "Threat"]}
          minWidth={980}
          rows={[
            [
              "DawnCraft",
              "Souls-like фанаты 14+",
              "Квест → бой (EFM) → лут → прогресс",
              "Первый массовый «Elden Ring в MC»",
              "Очень высокая (10,3М)",
              "Через паблишер-паки/Patreon-контент (жалобы игроков)",
              <strong key="t1">Very High</strong>,
            ],
            [
              "L_Ender's Cataclysm",
              "Любой RPG/survival игрок",
              "Дополняющий мод, не самостоятельный пак",
              "Готовые кинематографичные боссы",
              "Очень высокая (14,8М, мод)",
              "Бесплатно",
              <strong key="t2">High</strong>,
            ],
            [
              "Epic Fight (мод)",
              "Любой, кто хочет souls-combat",
              "Toggle «боевой режим» поверх ванильного лупа",
              "Готовая, поддерживаемая NeoForge 1.21.1 боёвка",
              "Высокая (3,7М+)",
              "Бесплатно",
              <strong key="t3">Very High</strong>,
            ],
            [
              "Мелкие EldenCraft-клоны (10+ паков)",
              "Тот же сегмент, нишевый",
              "Тот же паттерн EFM+Cataclysm",
              "Косметическая разница",
              "Низкая-средняя каждый, но много",
              "Нет",
              "Medium",
            ],
            [
              "Vault Hunters",
              "RPG/данженкролл фанаты",
              "Vault-раны → таланты → артефакты",
              "Уникальная progression-петля, живое SMP-сообщество",
              "Очень высокая (5,5М+)",
              "Нет прямой",
              "Medium",
            ],
          ]}
        />

        {/* 3. Install triggers */}
        <h2 id="install-triggers" className={h2}>
          3. Почему игроки ставят конкурентов (Install-триггеры)
        </h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>EVIDENCE:</strong> обзоры и описания DawnCraft и клонов системно указывают на один и тот
              же триггер — «почувствовать Elden Ring/Dark Souls внутри знакомой песочницы». Сам факт
              существования 10+ независимых паков с идентичным питчем — сильное доказательство спроса на саму
              идею, не на конкретную реализацию.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>EVIDENCE:</strong> один из независимых обзоров DawnCraft прямо называет интеграцию Epic
              Fight «достаточной причиной» поиграть хотя бы пару дней — то есть новизна боевой механики сама по
              себе является install-драйвером, независимо от качества остального контента.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>INFERENCE:</strong> совместный SMP/сервер (как у Vault Hunters, изначально выросшего из
              стрима CaptainSparklez/iskall85 и команды) — сильный органический ускоритель роста через
              контент-криэйторов. Rubezh сознательно откладывает это в Later — что убирает один из самых
              доказанных каналов роста жанра.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>HYPOTHESIS:</strong> лор/immersion как install-триггер отдельно от combat/loot — для этой
              конкретной ниши не подтверждён ни одним найденным кейсом; это тестируемая, но недоказанная
              гипотеза Rubezh (H7), а не рыночный факт.
            </span>
          </li>
        </ul>

        {/* 4. Pain points */}
        <h2 id="pain-points" className={h2}>
          4. Community Pain Points
        </h2>
        <p className={p}>Основано на прямых отзывах о DawnCraft (наиболее детализированный публичный корпус жалоб в этой нише):</p>
        <ul className={ul}>
          <li className={li}>
            <strong>Оптимизация/производительность</strong> — системная жалоба, повторяется у нескольких
            крупных RPG-паков.
          </li>
          <li className={li}>
            <strong>Разбалансировка оружия/мобов</strong> — «почему один тип моба спамит везде», «почему броня
            почти не имеет значения» — прямое противоречие обещанию «билд решает».
          </li>
          <li className={li}>
            <strong>Прогрессия, спрятанная за неочевидными гейтами</strong> — дожд-ролл в DawnCraft не открыт с
            начала и завязан на квест гильдии, о чём игрок не предупреждён; система репутации деревни наказывает
            игрока без внятного объяснения правил.
          </li>
          <li className={li}>
            <strong>Квесты без трекера, нудные и обязательные</strong> — то, что должно быть источником
            лора/прогресса, воспринимается как гриндовая преграда, а не как content.
          </li>
          <li className={li}>
            <strong>Нестабильность при модификации пака</strong> — «добавишь мод — сломаешь мир»; жалоба прямо
            связана с архитектурной хрупкостью большого кастомного стека.
          </li>
          <li className={li}>
            <strong>Ощущение overhype/undelivery</strong> — маркетинг обещает больше, чем пак поставляет на
            релизе; апдейты воспринимаются как урезание фана.
          </li>
          <li className={li}>
            <strong>Платный/эксклюзивный контент внутри бесплатного мода (Patreon-гейтинг)</strong> — прямо
            называется частью проблемы репутации DawnCraft у части аудитории.
          </li>
        </ul>
        <Callout label="Repeated pain point across multiple products">
          Разрыв между обещанием «система, а не декорация» и фактической реализацией баланса/производительности
          на релизе. Это прямая рыночная возможность для Rubezh — но именно то место, где маленькая
          волонтёрская команда рискует повторить ту же ошибку при похожем объёме кастомного контента (кастомные
          мобы + кастомная боёвка + производственные цепочки одновременно).
        </Callout>

        {/* 5. Desires */}
        <h2 id="desires" className={h2}>
          5. Community Desires
        </h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Explicit demand:</strong> боёвка, где «тайминг и позиционирование решают», а не только
              цифры урона — прямо артикулируется в обзорах DawnCraft как то, чего хотят, даже когда хвалят Epic
              Fight.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Repeated desire:</strong> квестовый/лор-слой, который не ощущается как обязательная
              grind-преграда перед «настоящей игрой».
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Unmet need:</strong> ни один найденный крупный souls-like-пак не предлагает системное
              выживание (еда/добыча/производство) как равноценный с боем столп — везде выживание либо
              ванильное, либо декоративное. Это реальный, задокументированный пробел.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Speculative opportunity (не доказано):</strong> спрос именно на отсутствие уворота как
              самостоятельную идентичность. Ни одного примера в найденных данных, где это тестировалось и
              понравилось аудитории этой ниши.
            </span>
          </li>
        </ul>

        {/* 6. Demand driver matrix */}
        <h2 id="demand-drivers" className={h2}>
          6. Demand Driver Matrix
        </h2>
        <DataTable
          head={["Driver", "Evidence", "Сила", "Релевантность для Rubezh"]}
          minWidth={820}
          rows={[
            [
              "«Elden Ring feel» в песочнице",
              "Сильная (10+ независимых паков, 10М+ загрузок лидера)",
              "High",
              "High, но это driver всей ниши, не Rubezh специфично",
            ],
            [
              "Тяжёлый, не-декоративный бой",
              "Сильная (повторяется в отзывах)",
              "High",
              "High — совпадает с Core Pillar",
            ],
            [
              "Совместный SMP/сервер с друзьями",
              "Сильная (двигатель роста Vault Hunters, DawnCraft-серверов)",
              "High",
              "Low в MVP (сознательно отложено) — риск для acquisition",
            ],
            [
              "Богатый, «проживаемый» лор/нарратив",
              "Средняя (спрос на story-driven паки типа Prominence II/Cisco's)",
              "Medium",
              "High — единственная ось, где Rubezh может быть первым",
            ],
            [
              "Системное выживание наравне с боем",
              "Слабо представлена конкурентами → недооценённый спрос",
              "Medium-High как gap",
              "High — реальный незанятый угол",
            ],
            [
              "Контент-объём (число билдов/мобов/боссов)",
              "Сильная корреляция с успехом (DawnCraft 200+ модов, Cataclysm 8 боссов)",
              "High",
              "Low в MVP (5–8 билдов, 2–4 моба) — осознанный компромисс, но рыночно это минус на старте",
            ],
          ]}
        />

        {/* 7. PMF gaps */}
        <h2 id="pmf-gaps" className={h2}>
          7. Product-Market Fit: разрывы
        </h2>
        <div className="mt-6 flex flex-col">
          {pmfSteps.map((step, i) => (
            <div
              key={step.label}
              className="relative pb-6 pl-6 last:pb-0"
              style={{
                borderLeft:
                  i < pmfSteps.length - 1 ? "2px solid var(--color-secondary-border)" : "2px solid transparent",
              }}
            >
              <div
                className="absolute -left-[7px] top-1 h-3 w-3 rounded-full"
                style={{ background: "var(--color-forest-600)" }}
              />
              <p className="text-[18px] font-semibold text-[var(--color-title)]">{step.label}</p>
              <p className="mt-1 text-[16px] leading-[1.7] text-[var(--color-secondary-text)]">{step.note}</p>
            </div>
          ))}
        </div>
        <Callout label="Главный вывод PMF-анализа">
          Продукт обещает X (уникальную боевую идентичность через отказ от уворота), а рынок этой конкретной
          ниши систематически выбирает Y (Epic Fight-подобный дожд-ролл как узнаваемый маркер «Elden
          Ring-фила»). Это не значит, что H1/H8 обязательно провалятся — но это значит, что ставка сделана
          против самого сильного наблюдаемого сигнала спроса в нише, а не вместе с ним.
        </Callout>

        {/* 8. Differentiation audit */}
        <h2 id="differentiation-audit" className={h2}>
          8. Дифференциация: аудит
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[15px] font-semibold uppercase tracking-wide text-[var(--color-title)]">
              Strong differentiators
            </p>
            <p className="mt-1 text-[14px] text-[var(--color-body)]">реально сильные, трудно копируемые</p>
            <ul className="mt-3 flex flex-col gap-2 text-[16px] leading-[1.6] text-[var(--color-secondary-text)]">
              <li className={li}>
                Лор/нарратив как отдельный, серьёзно проинвестированный столп — ни один найденный конкурент этим
                не занимается системно.
              </li>
              <li className={li}>
                Системное выживание (еда/добыча/производство) наравне с боем — реальный незанятый угол в этой
                конкретной нише.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[15px] font-semibold uppercase tracking-wide text-[var(--color-title)]">
              Weak differentiators
            </p>
            <p className="mt-1 text-[14px] text-[var(--color-body)]">легко копируются</p>
            <ul className="mt-3 flex flex-col gap-2 text-[16px] leading-[1.6] text-[var(--color-secondary-text)]">
              <li className={li}>
                «Полностью кастомная» боёвка/мобы сами по себе — игрок не отличит хорошо настроенный Epic
                Fight+датапак от кастомного движка; разница ощущается только в деталях полировки, которые как
                раз тяжелее всего дались DawnCraft.
              </li>
              <li className={li}>
                Сеттинг-микс (Elden Ring + Bloodborne + steampunk + cosmic horror) — эстетический микс, а не
                механика; у аналогов похожие эклектичные заявки.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[15px] font-semibold uppercase tracking-wide text-[var(--color-title)]">
              Claimed differentiators
            </p>
            <p className="mt-1 text-[14px] text-[var(--color-body)]">команда считает плюсом, доказательств нет</p>
            <ul className="mt-3 flex flex-col gap-2 text-[16px] leading-[1.6] text-[var(--color-secondary-text)]">
              <li className={li}>
                «Баланс билдов без доминирующих веток» — заявляется всеми RPG-паками одинаково; ни один
                задокументированный кейс не подтверждает, что это влияет на install/retention отдельно от общего
                качества.
              </li>
              <li className={li}>
                «Отказ от уворота = аутентичнее духу Elden Ring» — контринтуитивно и ни разу не протестировано
                на этой аудитории.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[15px] font-semibold uppercase tracking-wide text-[var(--color-title)]">
              Missing differentiators
            </p>
            <p className="mt-1 text-[14px] text-[var(--color-body)]">нужны, но пока не заявлены</p>
            <ul className="mt-3 flex flex-col gap-2 text-[16px] leading-[1.6] text-[var(--color-secondary-text)]">
              <li className={li}>
                Явный ответ на вопрос «чем это лучше, чем Epic Fight + Cataclysm + любой лор-мод, собранные за
                выходные» — сейчас в документе такого сравнения нет вообще.
              </li>
              <li className={li}>
                Видимый на скриншоте/трейлере визуальный язык, отличающий Rubezh от 10+ визуально похожих
                «Elden Ring in Minecraft» паков.
              </li>
            </ul>
          </div>
        </div>

        {/* 9. Market-critical MVP */}
        <h2 id="market-mvp" className={h2}>
          9. Market-Critical MVP
        </h2>
        <DataTable
          head={["Категория", "Элементы"]}
          minWidth={700}
          rows={[
            [
              <strong key="m1">Market Must-Have</strong>,
              "Без этого предложение слабеет катастрофически: (1) видимое на первом скриншоте/трейлере визуальное отличие от «ещё одного EldenCraft»; (2) хотя бы один по-настоящему запоминающийся lore/environmental-storytelling момент в регионе S0, который можно показать в трейлере отдельно от боя — иначе продукт продаётся ровно как остальные 10 клонов.",
            ],
            [
              <strong key="m2">Market Should-Have</strong>,
              "Понятный, явно артикулированный ответ «почему не Epic Fight» (баланс, ощущение веса, интеграция с производством) — нужен для доверия closed-альфа тестеров и контент-криэйторов.",
            ],
            [
              <strong key="m3">Market Nice-to-Have</strong>,
              "5–8 билдов на старте — само число не критично для рынка; критично, различимы ли билды ощутимо (H2), а не их количество.",
            ],
            [
              <strong key="m4">Market Irrelevant на этой стадии</strong>,
              "Точное число кастомных мобов (2 vs 4) — рынок не заметит разницы между 2 и 4 при первом впечатлении; ресурсы сюда менее приоритетны, чем в полировку одного хорошего lore-момента.",
            ],
          ]}
        />

        {/* 10. Gap analysis */}
        <h2 id="gap-analysis" className={h2}>
          10. Competitive Gap Analysis
        </h2>
        <DataTable
          head={["Capability", "Конкуренты", "Rubezh (MVP-план)", "Gap", "Важность"]}
          minWidth={980}
          rows={[
            [
              "Souls-like боевой фреймворк",
              "Готовый, зрелый, поддерживаемый (Epic Fight)",
              "Полностью с нуля, непроверен",
              "Rubezh тратит месяцы на то, что рынок получает бесплатно",
              <strong key="i1">Критический</strong>,
            ],
            [
              "Кастомные боссы/мобы тёмного фэнтези",
              "Готовые, зрелые (Cataclysm, 14,8М)",
              "2–4 кастомных моба с нуля",
              "Дублирование существующего решения",
              "Высокий",
            ],
            [
              "Лор/нарративная подача через находки",
              "Слабо развито у прямых конкурентов",
              "Заявлен как Pillar, но не реализован",
              <strong key="i2">Реальная возможность занять пустое место</strong>,
              <strong key="i3">Критический (в плюс)</strong>,
            ],
            [
              "Системное выживание как равный столп",
              "Практически отсутствует в этой нише",
              "Заявлен как Pillar",
              <strong key="i4">Реальная возможность</strong>,
              "Высокий (в плюс)",
            ],
            [
              "Совместный сервер/SMP с первого дня",
              "Есть у Vault Hunters, DawnCraft-серверов — доказанный growth loop",
              "Отложено в Later",
              "Теряется доказанный канал органического роста на старте",
              "Средний-высокий",
            ],
            [
              "Объём контента на релизе",
              "100–200+ модов у лидеров",
              "Дисциплинированный малый MVP",
              "Ожидаемо меньше «мяса» при первом сравнении на CurseForge",
              "Средний (осознанный компромисс)",
            ],
          ]}
        />

        {/* 11. Opportunity map */}
        <h2 id="opportunity-map" className={h2}>
          11. Opportunity Map
        </h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Defend:</strong> дисциплина малого MVP и явная фиксация рисков (сильная сторона процесса,
              не путать с рыночной силой продукта).
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Improve:</strong> сформулировать явное позиционирование против Epic Fight/DawnCraft —
              сейчас его нет даже во внутреннем документе, не то что в публичном питче.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Add:</strong> хотя бы один явно демонстрируемый «лор-крючок» (не текстовый, а через
              геймплей/находку), который можно показать в первом трейлере отдельно от боя.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Remove/пересмотреть:</strong> статус «кастомные мобы = MUST HAVE» — стоит явно проверить
              гипотезу «compat-слой на Cataclysm/Epic Fight + собственные датапаки» как более дешёвый путь к
              тому же ощущению, прежде чем инвестировать в полностью кастомную анимацию.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Validate до масштабирования контента:</strong> H1/H8 (ощущение боя без уворота) и H7 (лор
              реально держит внимание) — оба должны быть проверены на минимальном вертикальном срезе до
              вложения ресурсов в 5–8 билдов и кастомных мобов, с явным напоминанием, что честный негативный
              результат по H1/H8 должен разрешить возврат уворота, а не рационализацию через «недостаточно
              контента».
            </span>
          </li>
        </ul>

        {/* 12. Risks */}
        <h2 id="risks" className={h2}>
          12. Ключевые риски (рыночная проекция поверх раздела 17 Product Definition)
        </h2>
        <DataTable
          head={["Risk", "Вероятность", "Влияние", "Evidence", "Митигация"]}
          minWidth={1040}
          rows={[
            [
              "Нишевое насыщение: рынок уже видел «Elden Ring в Minecraft» 10+ раз",
              "Высокая",
              "Высокое",
              "10+ независимых паков + лидер с 10,3М загрузок",
              "Явное визуальное/нарративное отличие до релиза; тестировать реакцию «ещё один EldenCraft?» на closed-альфе",
            ],
            [
              "Build-vs-buy: кастомная боёвка/мобы дублируют бесплатные зрелые альтернативы",
              "Средняя-высокая",
              "Высокое (ресурсы команды)",
              "Epic Fight официально на NeoForge 1.21.1, Cataclysm тоже",
              "Технический спайк должен явно включать сравнение «наш результат vs Epic Fight+датапак»",
            ],
            [
              "Отказ от уворота не резонирует с аудиторией, ожидающей Epic Fight-подобный опыт",
              "Средняя",
              "Очень высокое (бьёт по центральной гипотезе)",
              "Все найденные конкуренты используют дожд-ролл как маркер жанра",
              "Ранний качественный тест именно этого вопроса, не после built-контента",
            ],
            [
              "Отсутствие сервера/SMP на старте лишает доказанного growth loop жанра",
              "Средняя",
              "Среднее",
              "Vault Hunters/DawnCraft выросли во многом через совместные SMP и криэйторов",
              "Явно спланировать co-op/creator-показ уже на этапе закрытой альфы, не откладывать до сервера",
            ],
            [
              "Малая команда против объёма контента у лидеров ниши",
              "Высокая",
              "Среднее",
              "DawnCraft — 200+ модов, команда с внешним финансированием",
              "MVP-дисциплина уже заложена в документ — сохранять её, не поддаваться scope creep",
            ],
          ]}
        />

        {/* 13. Monetization */}
        <h2 id="monetization" className={h2}>
          13. Монетизация: реальность вместо теории
        </h2>
        <p className={p}>
          Ключевое ограничение, которое стоит явно закрепить в документе:{" "}
          <strong>Minecraft Usage Guidelines Mojang прямо запрещают продажу модов/модпаков напрямую</strong> —
          монетизация допустима только через видео-платформы (реклама на YouTube/Twitch) и через
          сервер-специфичные cosmetics/подписки, не влияющие на баланс. Единственная активная коммерческая
          гипотеза Rubezh (раздел 21 документа) уже соответствует этому ограничению — это правильно и не
          требует изменений по существу. CurseForge/Overwolf со своей стороны монетизирует паки в основном
          через собственную рекламу в лаунчере, а не давая авторам паков продавать контент напрямую — то есть у
          команды в любом случае почти не будет прямого revenue-канала до перехода к собственному серверу.
        </p>
        <DataTable
          head={["Model", "Potential", "Complexity", "Risk", "Fit"]}
          minWidth={900}
          rows={[
            [
              "Донаты/Patreon за разработку (не за контент в игре)",
              "Средний",
              "Низкая",
              "Низкий, но репутационно чувствительно (DawnCraft получил негатив за «Patreon-gated content»)",
              "Приемлемо, если контент в самом MVP остаётся полностью бесплатным",
            ],
            [
              "Cosmetics на будущем каноническом сервере",
              "Средний-высокий (после retention)",
              "Средняя",
              "Средний (нужна архитектура, не нарушающая ToS)",
              "Соответствует уже принятой в документе гипотезе",
            ],
            [
              "Реклама на YouTube/Twitch через партнёрство с криэйторами",
              "Низкий прямой revenue, высокий acquisition-эффект",
              "Низкая",
              "Низкий",
              "Стоит использовать раньше, чем сейчас запланировано — как канал привлечения, не только монетизации",
            ],
          ]}
        />
        <p className={p}>
          <strong>Timing:</strong> Pre-MVP — ничего; MVP — ничего, кроме подготовки бренда/названия для будущих
          cosmetics; Post-launch (после альфы) — тест донат-модели на разработку; Scale (после подтверждённого
          D30 на сервере) — cosmetics/подписки, как и написано в документе.
        </p>

        {/* 14. Hypotheses */}
        <h2 id="hypotheses" className={h2}>
          14. Проверяемые рыночные гипотезы (дополнение к H1–H8)
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[16px] font-semibold text-[var(--color-title)]">H-M1</p>
            <p className="mt-1 text-[17px] leading-[1.75] text-[var(--color-secondary-text)]">
              Мы считаем, что аудитория souls-like/RPG-паков воспримет Rubezh как «ещё один клон DawnCraft»,
              если первый трейлер визуально не будет отличаться от существующих EldenCraft-паков. Мы поймём,
              что это так, если в комментариях к первому публичному тизеру повторится словосочетание «another
              DawnCraft/EldenCraft clone».
            </p>
          </div>
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[16px] font-semibold text-[var(--color-title)]">H-M2</p>
            <p className="mt-1 text-[17px] leading-[1.75] text-[var(--color-secondary-text)]">
              Мы считаем, что лор-подача через находки создаст более сильный install-hook, чем сама по себе
              боевая система, для той части аудитории, которая уже устала от souls-combat паков. Мы поймём это,
              если в закрытой альфе игроки, пришедшие ради лора, покажут более высокую сессионную длительность,
              чем пришедшие ради боя.
            </p>
          </div>
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-surface-border)" }}>
            <p className="text-[16px] font-semibold text-[var(--color-title)]">H-M3</p>
            <p className="mt-1 text-[17px] leading-[1.75] text-[var(--color-secondary-text)]">
              Мы считаем, что отсутствие совместного сервера с первого дня снизит органический охват через
              контент-криэйторов относительно DawnCraft/Vault Hunters паттерна. Мы поймём это по объёму
              органических упоминаний/видео в первые 30 дней после публикации альфы относительно базового
              уровня похожих релизов.
            </p>
          </div>
        </div>
        <DataTable
          head={["Hypothesis", "Test", "Signal", "Decision"]}
          minWidth={900}
          rows={[
            [
              "H1/H8 (бой без уворота)",
              "Закрытая альфа + прямой опрос «чего не хватает»",
              "Повторяющееся упоминание «не хватает уворота/парирования»",
              "Если ≥30–40% фидбэка — пересмотреть защитный инструмент до контентного масштабирования",
            ],
            [
              "H7 (лор держит внимание)",
              "Качественные интервью + метрика «попытки связать находки в историю»",
              "Спонтанные попытки игроков реконструировать сюжет вне подсказок",
              "Если отсутствует — усилить нарративный дизайн до расширения на другие регионы",
            ],
            [
              "H-M1 (визуальная неотличимость)",
              "A/B показ скриншотов/тизера узкой фокус-группе souls-like аудитории без названия пака",
              "Способность отличить Rubezh от рандомного EldenCraft-скриншота",
              "Если <50% отличают верно — пересмотреть арт-направление до релиза",
            ],
          ]}
        />

        {/* 15. Growth strategy */}
        <h2 id="growth-strategy" className={h2}>
          15. Growth Strategy (сжато)
        </h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Acquisition:</strong> учитывая насыщенность ниши, точка входа — не «ещё один трейлер про
              Elden Ring в Minecraft», а конкретный лор/выживание-момент, которого нет у DawnCraft;
              контент-криэйторы этой ниши уже сформированы — им нужен явный «hook», отличный от боя.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Activation:</strong> первое meaningful experience должно случиться до первого серьёзного
              боя — иначе игрок сравнивает бой с Epic Fight с первой минуты и всё решает по этому сравнению.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Retention:</strong> зависит критически от того, ощущается ли системное выживание петлёй, а
              не рутиной — единственная незанятая ось на рынке.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Referral/Community:</strong> co-op (даже без постоянного сервера) — минимально
              жизнеспособный growth loop жанра; полностью откладывать совместную игру до серверного направления
              рискованно для органического роста.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>CurseForge/Modrinth discoverability:</strong> релиз на NeoForge 1.21.1 даёт временное окно
              «первым в свежей версии», но требует, чтобы экосистема (Ad Astra и др.) не блокировала восприятие
              незрелости платформы — не критично для MVP S0–S1, но стоит мониторить.
            </span>
          </li>
        </ul>

        {/* 16. PD audit */}
        <h2 id="pd-audit" className={h2}>
          16. Аудит Product Definition v4
        </h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Vision:</strong> внутренне последовательна, но не отвечает явно на вопрос «почему не
              существующий Epic Fight/Cataclysm стек» — рекомендация добавить это как явный Open
              Question/Dependency.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Audience:</strong> Assumption корректно помечен как таковой; рыночно эта аудитория уже
              полностью охвачена конкурентами — стоит уточнить психографический под-сегмент (например,
              «разочаровавшиеся в DawnCraft»), а не просто демографию.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Problem:</strong> реальна, подтверждена внешними данными (разделы 4 и 9 этого отчёта).
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Differentiation:</strong> заявлена сильнее, чем подтверждена рынком; ключевая ставка (без
              уворота) идёт против наблюдаемого сигнала спроса.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>MVP:</strong> объём разумен по дисциплине, но два самых дорогих MUST HAVE (кастомная
              боёвка + кастомные мобы) дублируют бесплатные существующие решения — стоит явно рассмотреть гибрид
              (Epic Fight/Cataclysm как база + кастомные датапаки/анимации поверх) как вариант для снижения
              риска H6 и экономии команды.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Commercial Hypotheses:</strong> реалистичны и корректно отложены; соответствуют реальным
              ограничениям Minecraft Usage Guidelines.
            </span>
          </li>
        </ul>

        {/* 17. Final answer */}
        <h2 id="final-answer" className={h2}>
          17. Итоговый ответ на вопрос пользователя
        </h2>
        <div className="mt-2 flex flex-col divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
          <div className="py-4">
            <p className="text-[18px] font-semibold text-[var(--color-title)]">Насколько конкурентоспособен продукт?</p>
            <p className="mt-2 text-[17px] leading-[1.8] text-[var(--color-secondary-text)]">
              Умеренно-низко в текущей формулировке MVP, если критерий — «выделиться визуально и механически при
              первом клике Install» в нише, которая уже насыщена похожими по духу продуктами с многомиллионными
              загрузками. Выше среднего, если критерий — «удержать узкую, уже заинтересованную аудиторию через
              глубину лора и небутафорское выживание», при условии, что H1/H7/H8 подтвердятся на плейтесте.
            </p>
          </div>
          <div className="py-4">
            <p className="text-[18px] font-semibold text-[var(--color-title)]">Почему игрок должен выбрать именно его?</p>
            <p className="mt-2 text-[17px] leading-[1.8] text-[var(--color-secondary-text)]">
              Честный на сегодня ответ — пока не должен, кроме как из любопытства к самой команде/сеттингу.
              Убедительный ответ появится только после того, как будет продемонстрирован (не заявлен) лор-момент
              и боевое ощущение, которые нельзя получить, поставив Epic Fight и Cataclysm поверх любого другого
              пака за выходные.
            </p>
          </div>
          <div className="py-4">
            <p className="text-[18px] font-semibold text-[var(--color-title)]">Существует ли реальный спрос?</p>
            <p className="mt-2 text-[17px] leading-[1.8] text-[var(--color-secondary-text)]">
              Да — на саму идею «тяжёлый souls-like бой + фэнтези-лор в Minecraft» спрос огромный и подтверждённый
              (10М+ загрузок лидера ниши). На конкретно эту комбинацию (без уворота + системное выживание + лор
              уровня Elden Ring) спрос не измерен и не может считаться доказанным — это гипотеза, а не факт.
            </p>
          </div>
          <div className="py-4">
            <p className="text-[18px] font-semibold text-[var(--color-title)]">Где слабые места?</p>
            <p className="mt-2 text-[17px] leading-[1.8] text-[var(--color-secondary-text)]">
              (1) отсутствие явного, протестированного ответа «чем это лучше Epic Fight/Cataclysm»; (2)
              центральная механическая ставка идёт против наблюдаемого рыночного поведения аудитории; (3) объём
              кастомного контента у команды заведомо меньше, чем у лидеров ниши, при сопоставимом уровне
              амбиций; (4) отказ от сервера/co-op с первого дня убирает самый доказанный канал органического
              роста жанра.
            </p>
          </div>
        </div>
        <h3 className={h3}>Что нужно сделать, чтобы максимизировать шансы?</h3>
        <ul className={ul}>
          <li className={li}>
            Провести технический и качественный спайк, который явно сравнивает кастомную боёвку с Epic
            Fight+датапаками — не как формальность, а как настоящий go/no-go для объёма инвестиций в MUST HAVE.
          </li>
          <li className={li}>
            Довести лор/environmental storytelling до демонстрируемого, не текстового состояния уже в первом
            публичном материале — это единственная ось, где рынок пуст.
          </li>
          <li className={li}>
            Протестировать H1/H8 на реальных игроках этой аудитории до того, как под боевую систему будет
            построен контент — с готовностью вернуть уворот как опцию, если результат отрицательный.
          </li>
          <li className={li}>
            Пересмотреть полный отказ от co-op/сервера в MVP — минимально жизнеспособный совместный опыт с
            первого дня, а не только «Later», важен для органического роста в этой конкретной нише.
          </li>
          <li className={li}>
            Сформулировать явное позиционирование против DawnCraft/EldenCraft-клонов в самом Product Definition,
            а не только для внешнего маркетинга — сейчас в документе такого сравнения нет вообще, и его
            отсутствие — самый большой слепой угол v4.
          </li>
        </ul>

        {/* 18. Update: Prominence II */}
        <h2 id="update-prominence" className={h2}>
          18. Обновление: коррекция гипотезы + глубокий разбор Prominence II
        </h2>
        <Callout>
          Дополнение к отчёту после уточнения от команды: концепция Rubezh — не «бой Elden Ring без уворота», а
          билдостроение в духе Elden Ring (оружейные архетипы, weapon arts, разнообразие подходов),
          адаптированное под RPG-систему каста скиллов уровня WoW/PoE (активные способности на кулдаунах,
          ресурс маны/выносливости, дерево талантов), без уворота. А главная ценность для souls-игрока — не в
          механике уворота/пойза самой по себе, а в атмосфере, билдах, оружии, лоре и ворлдбилдинге. Это меняет
          то, с чем на самом деле нужно сравнивать продукт.
        </Callout>

        <h3 className={h3}>18.1 Почему это меняет анализ</h3>
        <p className={p}>
          В первой версии отчёта Rubezh сравнивался преимущественно с Epic Fight-паками (DawnCraft,
          EldenCraft-клоны) — то есть с продуктами, где именно ощущение боя является ядром обещания. Это было
          корректно для буквального прочтения «бой без уворота», но не для скорректированной концепции.
          Правильный тройной бенчмарк выглядит так:
        </p>
        <DataTable
          head={[
            "",
            "Souls-combat feel (вес, тайминг, стамина/пойз)",
            "Билд-разнообразие (архетипы + гибриды)",
            "Активный каст-слой (скиллы на кулдауне, WoW/PoE-стиль)",
            "Лор, который реально ощущается",
          ]}
          minWidth={1040}
          rows={[
            [
              <strong key="p1">DawnCraft / EldenCraft-клоны</strong>,
              "Сильно (Epic Fight)",
              "Слабо",
              "Практически нет",
              "Слабо",
            ],
            [
              <strong key="p2">Prominence II: Hasturian Era</strong>,
              "Отсутствует (не soulslike-бой, RPG-хак-н-слэш+магия)",
              "Заявлено сильно (10 «судеб», 16 пассивов, 5 активок, 100 стат-талантов)",
              "Сильно, явная отсылка к Diablo/PoE в самом описании пака",
              "Заявлено очень сильно (2 сюжетные линии, войсовер, столица с NPC) — но именно это хуже всего работает на практике",
            ],
            [
              <strong key="p3">Rubezh (целевая позиция)</strong>,
              "Цель: сильно, но без i-frame",
              "Цель: сильно, гибрид Elden-архетипов + PoE/WoW-каста",
              "Цель: сильно",
              "Цель: сильно, через находки, не текст",
            ],
          ]}
        />
        <p className={p}>
          <strong>Вывод: ни один найденный продукт не закрывает все четыре оси одновременно.</strong> Это
          настоящее белое пятно — но белое пятно ровно потому, что оно evidently трудно достижимо: самый близкий
          претендент (Prominence II) при 5 годах разработки, финансировании через Patreon/хостинг-партнёрства и
          14,5 млн загрузок так и не решил две из четырёх осей (лор, который трогает, и билд-баланс без
          доминирующей меты).
        </p>

        <h3 className={h3}>18.2 Prominence II: Hasturian Era — детальный разбор</h3>
        <p className={p}>
          <strong>Масштаб:</strong> 14,5 млн загрузок (12,5М CurseForge + 1,9М Modrinth), Fabric 1.20.1, 449
          модов («extra large» по классификации платформы), в разработке с апреля 2021 (студия Cinderstone
          Studios / автор ElocinDev), актуальная мажорная версия v4.0 вышла в 2026 году. Рейтинг на независимой
          площадке ModDex — 3,2 из 5 при 18 оценках, при этом Gameplay 3,1/5, Performance 3,1/5, Aesthetics
          3,5/5. Монетизация — Patreon + партнёрская ссылка на хостинг-провайдера со скидочным кодом; сама игра
          остаётся бесплатной, что соответствует Minecraft Usage Guidelines.
        </p>
        <p className={p}>
          <strong>Билд-система (то, что ближе всего к идее Rubezh):</strong> дерево талантов с 10 архетипами
          («fates»), 16 пассивными талантами, 5 активными способностями и 100 статовыми талантами; отдельно —
          система артефактного оружия с уникальными способностями (названия артефактов напрямую отсылают к WoW
          — «Frostmourne», «Scythe of the Damned» — то есть команда Prominence уже эксплуатирует ровно ту же
          WoW-эстетику каста/лута, которую описывает founder Rubezh) и endgame-система бесконечно
          масштабирующихся боссов с рандомными аффиксами («Mythic Challenges»).
        </p>
        <p className={p}>
          <strong>Что реально говорят игроки о билд-разнообразии — самое важное для Rubezh:</strong>
        </p>
        <ul className={ul}>
          <li className={li}>
            Один из детальных обзоров прямо называет ощущение выбора билда иллюзией: несмотря на формальное
            разнообразие путей, игроков системно затягивает к одному «оптимальному» пути, а сам процесс сильно
            завязан на RNG (найдёшь ли нужный артефакт), из-за чего билд, который игрок хотел собрать, часто
            недостижим за десятки часов игры.
          </li>
          <li className={li}>
            Более резкий обзор идёт дальше: дальнобойные билды (арбалет) оказываются настолько сильны и
            безопасны, что тривиализируют контент независимо от вложений в дерево талантов, тогда как ближний
            бой вынужден балансировать между посредственным уроном и выживанием — то есть баланс архетипов не
            выдержан на практике, и само талант-дерево не компенсирует разрыв.
          </li>
          <li className={li}>
            Ещё один обзор описывает похожую динамику: слаженная группа из трёх игроков прошла всю доступную на
            тот момент прогрессию за 3–4 дня и уже к середине первой главы упёрлась в потолок доступного
            контента, потеряв ощущение цели в основном сюжете.
          </li>
        </ul>
        <p className={p}>
          <strong>
            Что реально говорят игроки о лоре — это критично для решения «вести коммуникацию с находок, а не с
            боя»:
          </strong>
        </p>
        <ul className={ul}>
          <li className={li}>
            Самый детальный критический разбор указывает на прямое противоречие между заявленной темой
            (вторжение космического зла, отсылка к Хастуру/Королю в Жёлтом) и тем, что это ощущается в игре:
            100+ часов игры — а история, по словам автора, ни разу не тронула эмоционально; титульный
            «хасторианский» антагонист сведён к финальному боссу-реролу с баффами. Итоговая формулировка автора:
            пак пытается быть driven историей, реально её не driving.
          </li>
          <li className={li}>
            Другой обзор отдельно выделяет, что при богатом наборе NPC-диалогов и кастомном контенте пак почти
            не создаёт immersion, достаточной, чтобы «погрузиться» в историю.
          </li>
          <li className={li}>
            При этом позитивные обзоры (4–5★) отдельно хвалят именно исполнение: качество кастомного оружия и
            анимаций, подачу сюжетной прогрессии применительно к боссам, атмосферу столицы Vaaz — то есть
            аудитория явно ценит именно атмосферу/арт/билд-фантазию, а не «мех бой», что подтверждает тезис
            founder&apos;а о том, где на самом деле лежит soulslike-привлекательность для этой аудитории.
          </li>
          <li className={li}>
            Систематическая жалоба на «kitchen sink»-размытие идентичности (зачем в medieval-fantasy RPG
            высокотехнологичные моды вроде Tech Reborn/Modern Industrialization/Ad Astra, которые не
            интегрированы с кастомным контентом пака) — прямое предупреждение для Rubezh: одновременное
            равнозначное позиционирование «бой + выживание + производство + лор» рискует таким же размытием
            фокуса, если производственные цепочки не будут явно нарративно и механически прошиты в один и тот
            же мир.
          </li>
        </ul>
        <Callout label="Вывод по Prominence II">
          Это не провал, но и не решённая задача. 14,5М загрузок доказывают, что спрос на «билдостроение в духе
          PoE/WoW внутри Minecraft-RPG с лором» реален и велик. Но структурные слабости (иллюзия выбора билда,
          лор, который не трогает, размытие идентичности) сохраняются даже спустя пять лет разработки и при
          наличии монетизации/финансирования команды. Технически задача решаема, но это одна из самых трудных
          для исполнения комбинаций во всей нише, а не «безопасная гавань», в которую можно просто перейти
          вместо боёвки.
        </Callout>

        <h3 className={h3}>18.3 Технический слой: скорректированная концепция уже частично собираема из готовых блоков</h3>
        <p className={p}>
          Для полноты картины: WoW/PoE-стиль каста скиллов на кулдаунах/мане в экосистеме NeoForge 1.21.1 —
          тоже не белое пятно с точки зрения инструментов.
        </p>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>Iron&apos;s Spells &apos;n Spellbooks</strong> — зрелый, активно поддерживаемый мод
              именно WoW/PoE-типа: заклинания на кулдаунах, мана, «школы» магии, свитки-предметы, официальные
              твики под NeoForge 1.21.1 (актуальный аддон конфигурации выпущен в мае 2026).
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Pufferfish&apos;s Skills</strong> — универсальный фреймворк дерева навыков, 63 млн
              загрузок, официально поддерживается вплоть до NeoForge 1.21.1 и новее; поверх него уже существуют
              специализированные датапаки школ магии, явно спроектированные для RPG-focused модпаков — буквально
              то же ценностное предложение, что описывает founder.
            </span>
          </li>
          <li className={li}>
            Есть готовый аддон «Epic Fight Skill – Iron&apos;s Spells &apos;n Spellbooks», который прямо сшивает
            мили-бой Epic Fight (вес, тайминг, стамина — без принудительного использования уворота) с активным
            кастом Iron&apos;s Spells в единый архетип «spellsword» — то есть связка «Elden-подобный вес оружия
            + WoW/PoE-каст» уже существует как готовый, работающий мод, а не гипотеза.
          </li>
        </ul>
        <p className={p}>
          Это не аргумент «не делайте свою систему» — своя система может дать лучший фидбэк, полнее
          интегрироваться с production/survival-петлёй и не тащить за собой балласт совместимости чужих модов.
          Но это значит, что{" "}
          <strong>
            технический спайк (раздел 20 Product Definition, зависимость «а») обязан явно ответить на вопрос:
            что наша кастомная система даёт игроку, чего не даёт связка Epic Fight + Iron&apos;s Spells +
            Pufferfish&apos;s Skills за один уикенд конфигурации
          </strong>{" "}
          — иначе объём инвестиций в MUST HAVE не оправдан рыночно, независимо от того, насколько хорошо
          реализована кастомная версия.
        </p>

        <h3 className={h3}>18.4 Подтверждение решения «первое сообщение — мир и находки, не бой»</h3>
        <p className={p}>
          Это решение подтверждается напрямую данными раздела 18.2, и это, вероятно, самый сильный вывод всего
          обновления:{" "}
          <strong>
            у наиболее прямого конкурента по билд-глубине и лор-амбиции (Prominence II) именно подача истории —
            самое системно критикуемое место
          </strong>
          , несмотря на войсовер, диалоговую систему, две сюжетные линии и пятилетнюю разработку. Это означает,
          что рынок в этой нише получил инфраструктуру лора (квесты, диалоги, войсовер) от лидера ниши, но не
          получил ощущение лора — и это ощущение остаётся неудовлетворённым спросом, а не гипотезой. Если Rubezh
          сможет на MVP-масштабе одного региона продемонстрировать не объём лора, а именно эффект присутствия и
          находки, первое сообщение бренда, построенное на находках, а не на бою, становится не просто
          безопасным выбором по остаточному принципу, а осознанной, рыночно обоснованной стратегией: это
          единственная ось, где лидер ниши с 14,5М загрузок и пятилетним фидбэк-циклом всё ещё не нашёл решения.
        </p>
        <p className={p}>
          Стоит зафиксировать это явно на уровне геймдизайн-документа (не только маркетингового месседжинга):
          критерий успеха прото-слоя лора в MVP — не «квесты есть» и не «войсовер есть», а конкретно эффект,
          которого не хватает Prominence: ощутимая, непрошеная эмоциональная реакция игрока на находку/событие,
          без необходимости в объяснительном тексте. Это тот полюс, который тестирует H7, и именно этот полюс, а
          не объём контента, должен быть критерием go/no-go по итогам закрытой альфы.
        </p>

        <h3 className={h3}>18.5 Обновлённые риски и рекомендации с учётом коррекции</h3>
        <DataTable
          head={["Что изменилось", "Было в v1 отчёта", "Стало после коррекции"]}
          minWidth={980}
          rows={[
            [
              "Главный риск центральной боевой гипотезы",
              "«Отказ от уворота противоречит рыночному сигналу Epic Fight-аудитории»",
              "Смягчается: если бой — не первичный install-hook, а часть общего ощущения, планка ниже. Но риск не исчезает полностью: у Prominence (где бой тоже не главный хук) всё равно есть жалобы именно на ощущение боя — то есть даже вторичный по важности бой обязан не отталкивать",
            ],
            [
              "Главный риск лор-пилара",
              "«Гипотеза H7 не проверена ни одним аналогом»",
              "Уточняется и усиливается: H7 проверялась косвенно — крупнейший конкурент по амбиции (Prominence II) её не подтвердил на практике, несмотря на серьёзные вложения. Это поднимает планку: недостаточно «квесты + находки + войсовер», нужен именно эффект присутствия",
            ],
            [
              "Риск build-vs-buy на боевую систему",
              "Сравнение с Epic Fight/Cataclysm как готовыми альтернативами",
              "Дополняется: полный «buy»-стек для скорректированной концепции (Epic Fight + Iron's Spells + Pufferfish's Skills + готовые аддоны-мосты) уже существует и покрывает почти все технические требования; вопрос сдвигается на «даёт ли кастомная реализация преимущество, которое эта связка структурно не может дать»",
            ],
            [
              "Риск баланса билдов",
              "«Заявленный принцип 'без доминирующих билдов' — Claimed differentiator без доказательств»",
              "Усиливается конкретным прецедентом: у Prominence II ranged/crossbow-билд документированно обесценивает вложения в дерево талантов и мили-архетипы — воспроизведённый сбой конкретно в системе того же типа, которую Rubezh собирается строить",
            ],
          ]}
        />
        <Callout label="Дополненная рекомендация">
          Технический и качественный спайк (раздел 22 Product Definition) должен включать не только вопрос
          «ощущается ли бой без уворота весомым» (H1/H8), но и явную проверку двух вещей, для которых Prominence
          II даёт готовый негативный прецедент: (а) не создаёт ли планируемая система каста/дерева талантов
          доминирующий архетип-паттерн уже на первых 5–8 билдах MVP; (б) действительно ли прото-слой лора
          региона S0 создаёт непрошеную эмоциональную реакцию у тестеров, а не просто фиксируется как «квесты
          выполнены, находки собраны».
        </Callout>

        <p className="mt-10 text-[14px] italic leading-[1.7] text-[var(--color-body)]">
          Отчёт основан на открытых данных CurseForge, Modrinth, GDLauncher, ModDex, GitHub и профильных блогов
          по состоянию на сентябрь 2026. Downloads-метрики отражают совокупные исторические загрузки продуктов,
          а не текущую активную аудиторию (DAU/MAU данные не публикуются платформами открыто) — это ограничение
          стоит учитывать при интерпретации «популярности» как прокси для текущего спроса. Оценки ModDex
          (например, 3,2/5 у Prominence II) основаны на малой выборке (18 оценок при 14,5М загрузок) и не
          претендуют на статистическую репрезентативность всей аудитории — они используются здесь как источник
          качественных, а не количественных сигналов.
        </p>
      </article>
    </div>
  );
}
