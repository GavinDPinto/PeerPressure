import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Check, ChevronDown, Trash2 } from "lucide-react";
import Badge from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";
import { cn } from "../lib/utils.js";

export default function Task({
  id,
  title,
  pointValue,
  description,
  schedule,
  completedToday,
  onComplete,
  onDelete,
}) {
  const [open, setOpen] = useState(false);

  const handleComplete = (e) => {
    e.stopPropagation();
    onComplete?.(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <Motion.div
      layout
      onClick={() => setOpen((o) => !o)}
      className={cn(
        "cursor-pointer rounded-xl border bg-surface-2 p-4 transition-colors",
        completedToday ? "border-success/30" : "border-line hover:border-brand/40"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
            completedToday ? "border-success bg-success text-white" : "border-line text-transparent"
          )}
        >
          <Check size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className={cn("truncate font-semibold", completedToday && "text-muted line-through")}>
            {title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge tone="brand">{pointValue} pts</Badge>
            <Badge tone="neutral">{schedule}</Badge>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </div>

      {open && (
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="ml-11 mt-3 flex flex-col gap-3">
            {description && <p className="text-sm text-muted leading-relaxed">{description}</p>}
            <div className="flex gap-2">
              {!completedToday && (
                <Button variant="success" size="sm" onClick={handleComplete}>
                  <Check size={15} /> Complete
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 size={15} /> Delete
              </Button>
            </div>
          </div>
        </Motion.div>
      )}
    </Motion.div>
  );
}
