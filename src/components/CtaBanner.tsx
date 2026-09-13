import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description?: string;
  action?: string;
  href?: string;
};

export default function CtaBanner({ title, description, action, href }: CtaBannerProps) {
  return (
    <div
      className="rounded-lg px-6 py-8 text-center"
      style={{ background: "var(--color-cta-gradient)" }}
    >
      <h2 className="text-xl font-semibold text-[var(--color-cta-title)]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-cta-title)]/90">
          {description}
        </p>
      ) : null}
      {action && href ? (
        <div className="mt-5 flex justify-center">
          <Link
            href={href}
            className="rounded-md bg-[var(--color-cta-button-bg)] px-4 py-2 text-sm font-medium text-[var(--color-cta-button-text)] transition-opacity hover:opacity-90"
          >
            {action}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
