import { cn } from "../../lib/utils.js";

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
      )}
      <input
        className={cn(
          "w-full rounded-xl bg-surface-2 border border-line text-fg placeholder-muted",
          "px-4 py-3 ring-focus transition-colors",
          Icon && "pl-11",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl bg-surface-2 border border-line text-fg placeholder-muted",
        "px-4 py-3 ring-focus transition-colors resize-none leading-relaxed",
        className
      )}
      {...props}
    />
  );
}
