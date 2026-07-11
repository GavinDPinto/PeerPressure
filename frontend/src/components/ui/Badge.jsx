import { cn } from "../../lib/utils.js";

const tones = {
  brand: "bg-brand-soft text-on-brand-soft",
  neutral: "bg-surface-2 text-muted border border-line",
  success: "bg-success-soft text-success",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

export default function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
