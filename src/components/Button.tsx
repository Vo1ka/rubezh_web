import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90";

  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]"
      : "border bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)] border-[var(--color-secondary-border)]";

  return <button className={`${base} ${variantClass} ${className}`} {...props} />;
}
