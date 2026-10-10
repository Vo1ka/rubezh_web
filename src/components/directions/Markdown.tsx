import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Rendering for STATUS/JOURNAL text from the repo. No typography plugin in
// the project, so the few elements those files use are styled here.
const components: Components = {
  h1: ({ children }) => <h3 className="mt-3 text-base font-semibold text-[var(--color-title)]">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-3 text-base font-semibold text-[var(--color-title)]">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-2 text-sm font-semibold text-[var(--color-title)]">{children}</h4>,
  p: ({ children }) => <p className="my-1.5">{children}</p>,
  ul: ({ children, className }) => (
    <ul className={`my-1.5 flex flex-col gap-1 pl-5 ${className?.includes("contains-task-list") ? "list-none pl-1" : "list-disc"}`}>
      {children}
    </ul>
  ),
  ol: ({ children }) => <ol className="my-1.5 flex list-decimal flex-col gap-1 pl-5">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-80">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[var(--color-surface-bg)] px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded bg-[var(--color-surface-bg)] p-3 text-xs">{children}</pre>
  ),
  input: ({ checked }) => <input type="checkbox" checked={checked} readOnly className="mr-1.5 align-middle" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 pl-3 opacity-80" style={{ borderColor: "var(--color-surface-border)" }}>
      {children}
    </blockquote>
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-[var(--color-body)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
