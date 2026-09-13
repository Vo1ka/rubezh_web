import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-article",
});

export const metadata: Metadata = {
  title: "Маркетинговая оценка — Rubezh",
  description:
    "Независимая маркетинговая оценка проекта Rubezh на основе Product Definition v4 (12.09.2026).",
};

const h2 = "mt-12 text-[26px] font-semibold text-[var(--color-title)]";
const h3 = "mt-8 text-[21px] font-semibold text-[var(--color-title)]";
const p = "mt-4 text-[18px] leading-[1.85] text-[var(--color-secondary-text)]";
const ul = "mt-4 flex flex-col gap-3 text-[18px] leading-[1.75] text-[var(--color-secondary-text)]";
const li = "flex gap-3 before:mt-[11px] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--color-forest-600)]";

const risks: { claim: string; risk: string; mitigation: string }[] = [
  {
    claim: "«Бой как в Elden Ring, только без уворота»",
    risk: "Ядро soulslike-аудитории воспринимает dodge-roll как обязательный элемент жанра; несовпадение ожиданий → негативные отзывы на CurseForge/Modrinth/Reddit в духе «урезанный souls-like».",
    mitigation: "Не публиковать это сравнение до качественной валидации H1/H8 на закрытой альфе S0–S1.",
  },
  {
    claim: "«Полностью авторский мир и боевая система»",
    risk: "Низкий — это фактическое отличие от модпаков, проверяемое уже сейчас (архитектура, а не ощущение).",
    mitigation: "Можно продвигать сразу — devlog, технические разборы, дневники разработки.",
  },
  {
    claim: "«Насыщенный лором мир, глубина уровня Elden Ring»",
    risk: "Средний — полнота свода лора вне MVP; ожидание «полного мира» на старте не подтверждено объёмом контента.",
    mitigation: "Формулировать как «метод подачи», не «объём» — тестируется на одном регионе (H7), не на своде.",
  },
  {
    claim: "Сравнение по объёму контента (билды, мобы, регионы)",
    risk: "MVP сознательно мал (5–8 билдов, 2–4 моба, один регион); сравнение с ATM10/MC Eternal 2 прямо отклонено самим продуктом.",
    mitigation: "Явно рамить «малое и плотное» как достоинство, избегать количественных сопоставлений с крупными сборками.",
  },
  {
    claim: "Любой намёк на монетизацию/косметику",
    risk: "Коммерческий горизонт сдвинут за подтверждённый D30 retention на серверном направлении, которого ещё нет.",
    mitigation: "Не поднимать тему монетизации в публичных материалах до этой стадии — риск путаницы об экономической модели бесплатного продукта.",
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
          Маркетинговая оценка · источник: Product Definition v4, 12.09.2026
        </p>
        <h1 className="mt-2 text-[38px] font-bold leading-tight text-[var(--color-title)]">
          Маркетинговая оценка проекта Rubezh
        </h1>
        <p className={p}>
          Ниже — независимая оценка Product Definition v4 с точки зрения маркетинга и
          коммуникации с аудиторией, а не геймдизайна. Вопрос, на который она отвечает: если
          прямо сейчас начать рассказывать об этом продукте внешней аудитории, что можно
          говорить честно, а что станет обещанием, которое продукт пока не подтвердил.
        </p>

        <div
          className="mt-8 rounded-lg border p-5"
          style={{ borderColor: "var(--color-secondary-border)", background: "var(--color-secondary-bg)" }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Коротко
          </p>
          <p className="mt-2 text-[18px] leading-[1.8] text-[var(--color-secondary-text)]">
            У проекта есть чёткое, произносимое в одной фразе отличие от модпаков — но оно
            держится на гипотезе, которая ещё не проверена ни одним плейтестом (H1/H8: бой без
            уворота ощущается «как Elden Ring», а не как урезанная версия). Маркетинг, который
            обещает это ощущение раньше, чем оно подтверждено, — главный риск на горизонте
            ближайших месяцев. Всё остальное в позиционировании можно продвигать уже сейчас.
          </p>
        </div>

        <h2 className={h2}>Позиционирование: сильное, но тройное</h2>
        <p className={p}>
          Документ формулирует отличие через три равнозначных столпа: тайминг-бой без уворота,
          системное выживание и лор уровня Elden Ring. Для продукта это осознанный и логичный
          выбор — ни один из столпов не декоративен. Для маркетингового сообщения это сложнее:
          три равновесных заявления в одном питче размывают фокус первого впечатления
          (трейлер, страница на Modrinth, первый пост в Discord).
        </p>
        <p className={p}>
          Рекомендация: на уровне продукта столпы остаются равными, но в коммуникации нужен один
          <em> hero-claim</em> и два поддерживающих. Из всех трёх лор — единственный, который
          можно показать содержательно уже на MVP-масштабе одного региона без риска
          «недостаточно контента» (см. ниже). Логичный кандидат на первое сообщение — не бой, а
          мир и находки.
        </p>

        <h2 className={h2}>Целевая аудитория: два разных ожидания в одном определении</h2>
        <p className={p}>
          Аудитория в документе — Assumption: «16+, знакомые с souls-like и/или модовыми
          RPG-сборками». Это фактически две разные аудитории с противоположными ожиданиями от
          продукта:
        </p>
        <ul className={ul}>
          <li className={li}>
            Souls-like игроки ждут узнаваемую формулу жанра — уворот в ней исторически ядровой
            элемент; его отсутствие нужно объяснять как осознанный выбор, а не как упрощение.
          </li>
          <li className={li}>
            Аудитория модовых RPG-сборок чаще оценивает продукт по объёму — количеству билдов,
            мобов, регионов; MVP сознательно мал по всем этим осям.
          </li>
        </ul>
        <p className={p}>
          Одно сообщение не убедит обе группы одинаково. Возраст, регион и размер стартового
          комьюнити в документе прямо помечены как Unknown — это нормально для старта разработки,
          но означает, что сейчас нет обоснованного плана охвата, только гипотеза о том, кто
          продукт оценит.
        </p>

        <h2 className={h2}>Что можно продвигать уже сейчас</h2>
        <ul className={ul}>
          <li className={li}>
            <span>
              <strong>История разработки с нуля.</strong> Полностью авторская боевая система,
              дерево способностей, мобы — это проверяемый факт архитектуры, а не ощущение. Хорошо
              ложится в devlog-формат и технические разборы, не создаёт риска несовпавших
              ожиданий.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Лор через находки и окружение.</strong> Прото-слой лора для одного региона
              — единственный элемент из трёх столпов, который уже в MVP можно показать
              содержательно: скриншоты предметов, environmental storytelling, тизеры истории без
              спойлеров.
            </span>
          </li>
          <li className={li}>
            <span>
              <strong>Бесплатный вход без намёка на монетизацию.</strong> Единственная активная
              коммерческая гипотеза сейчас — бесплатный публичный доступ; это снижает трение при
              первом знакомстве и не требует оправдывать цену на неподтверждённом продукте.
            </span>
          </li>
        </ul>

        <h2 className={h2}>Что рано продвигать</h2>
        <p className={p}>
          Главный тезис дифференциации — «весомый бой в духе Elden Ring без уворота» — это гипотезы
          H1 и H8, обе со статусом Confidence: Low/Unknown, обе проверяются только закрытой альфой
          S0–S1. Публичное заявление об ощущении боя раньше этой проверки — это продажа обещания,
          а не факта. Тот же принцип касается объёма контента: явный отказ от сравнения с крупными
          модпаками (ATM10, MC Eternal 2) зафиксирован в самом документе как Rejected — маркетинг
          не должен случайно создавать это сравнение выбором формулировок или скриншотов.
        </p>

        <h2 className={h2}>Матрица маркетинговых рисков</h2>
        <div
          className="mt-4 overflow-x-auto rounded-lg border"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <table className="w-full min-w-[640px] border-collapse text-left text-[16px]">
            <thead>
              <tr style={{ background: "var(--color-surface-bg)" }}>
                <th className="p-3 font-semibold text-[var(--color-title)]">Заявление</th>
                <th className="p-3 font-semibold text-[var(--color-title)]">Риск</th>
                <th className="p-3 font-semibold text-[var(--color-title)]">Что делать</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((row) => (
                <tr key={row.claim} className="border-t" style={{ borderColor: "var(--color-surface-border)" }}>
                  <td className="p-3 align-top font-medium text-[var(--color-secondary-text)]">
                    {row.claim}
                  </td>
                  <td className="p-3 align-top text-[var(--color-secondary-text)]">{row.risk}</td>
                  <td className="p-3 align-top text-[var(--color-secondary-text)]">
                    {row.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={h2}>Коммерческий горизонт</h2>
        <p className={p}>
          Единственная активная коммерческая гипотеза — бесплатный вход → подтверждённый опыт →
          (в перспективе, после перехода к серверному направлению и подтверждённого D30 retention)
          — cosmetics/подписка. Порядок правильный: продукт не монетизируется раньше, чем
          подтверждён. Следствие для маркетинга — у любой активности сейчас нет горизонта прямой
          окупаемости; это работа на узнаваемость и будущую команду/комьюнити, а не воронка продаж,
          и планировать её ресурс (время волонтёрской команды, 4–6 ч/день) нужно соответствующе.
        </p>

        <h3 className={h3}>Рекомендации по срокам</h3>
        <ul className={ul}>
          <li className={li}>
            Сейчас: devlog и лор-контент — низкий риск, можно начинать без ограничений.
          </li>
          <li className={li}>
            После технического спайка и решения по защитному инструменту боя (открытые вопросы,
            раздел 19 Product Definition): первые содержательные упоминания боевой системы —
            без заявлений об ощущении.
          </li>
          <li className={li}>
            После закрытой альфы S0–S1 и качественной валидации H1/H2/H7/H8: полноценная кампания
            вокруг дифференциации «бой без уворота, но не хуже».
          </li>
          <li className={li}>
            После перехода к серверному направлению и подтверждённого D30: любые упоминания
            cosmetics/подписки.
          </li>
        </ul>
      </article>
    </div>
  );
}
