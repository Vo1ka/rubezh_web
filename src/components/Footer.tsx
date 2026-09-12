export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-surface-border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-[var(--color-footer-text)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} Rubezh Web</span>
        <div className="flex gap-4">
          <a
            href="https://github.com/Vo1ka/rubezh_web"
            className="font-medium text-[var(--color-footer-link)] hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
