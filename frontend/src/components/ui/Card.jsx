import { cn } from "../../lib/utils.js";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-2xl shadow-(--shadow-sm)",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
