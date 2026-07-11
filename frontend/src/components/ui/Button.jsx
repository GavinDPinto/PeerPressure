import { cn } from "../../lib/utils.js";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ring-focus disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer";

const variants = {
  primary:
    "grad-brand text-brand-fg shadow-(--shadow-brand) hover:brightness-110",
  secondary:
    "bg-surface-2 text-fg border border-line hover:bg-line/60",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  danger:
    "bg-danger-soft text-danger border border-danger/30 hover:bg-danger hover:text-white",
  success:
    "bg-success text-white hover:brightness-110 shadow-sm",
};

const sizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
  icon: "p-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  as,
  ...props
}) {
  const Comp = as || "button";
  return (
    <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
