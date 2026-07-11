import { cn } from "../../lib/utils.js";

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-2",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-gradient-to-r after:from-transparent after:via-line/60 after:to-transparent",
        "after:animate-[shimmer_1.5s_infinite]",
        className
      )}
    />
  );
}
