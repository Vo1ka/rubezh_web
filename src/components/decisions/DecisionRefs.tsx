import Link from "next/link";
import { engineeringDecisionHref } from "@/lib/documents";

// RW-20: `D-38` in a site record links to that entry of the engineering
// decision log in the repo (the log is the master, the site refers by number).
export default function DecisionRefs({ text }: { text: string }) {
  const parts = text.split(/\b(D-\d+)\b/);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^D-(\d+)$/);
        return m ? (
          <Link
            key={i}
            href={engineeringDecisionHref(m[1])}
            className="underline decoration-dotted underline-offset-2 hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
            title="Инженерный лог решений (mine_boevka)"
          >
            {part}
          </Link>
        ) : (
          part
        )
      })}
    </>
  );
}
