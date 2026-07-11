import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import TaskCard from "./TaskCard.jsx";
import Button from "./ui/Button.jsx";

export default function TaskSuggestions({ tasks, onDelete }) {
  const [showAll, setShowAll] = useState(false);

  if (!tasks || tasks.length === 0) return null;

  const displayedTasks = showAll ? tasks : tasks.slice(0, 5);
  const hasMore = tasks.length > 5;

  return (
    <div className="mt-3 max-w-[90%] space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
        <CheckCircle2 size={14} />
        Added to your task list
      </p>
      {displayedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))}
      {hasMore && (
        <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)} className="w-full">
          {showAll ? "Show less" : `Show all (${tasks.length})`}
        </Button>
      )}
    </div>
  );
}
