import { X } from "lucide-react";
import Badge from "./ui/Badge.jsx";

export default function TaskCard({ task, onDelete }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{task.title}</p>
        {task.description && (
          <p className="mt-0.5 text-xs text-muted line-clamp-2">{task.description}</p>
        )}
        <div className="mt-2 flex gap-1.5">
          <Badge tone="brand">{task.points} pts</Badge>
          <Badge tone="neutral">{task.type}</Badge>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        title="Remove this task"
        className="shrink-0 cursor-pointer rounded-lg p-1 text-muted ring-focus hover:bg-danger-soft hover:text-danger transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
