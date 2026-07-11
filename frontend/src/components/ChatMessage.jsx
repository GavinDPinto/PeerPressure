import { motion as Motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import TaskSuggestions from "./TaskSuggestions.jsx";
import { cn } from "../lib/utils.js";

export default function ChatMessage({ message, taskList, onDeleteTask }) {
  const isUser = message.sender === "user";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col", isUser && "items-end")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser ? "grad-brand text-brand-fg" : "bg-surface-2 text-fg"
        )}
      >
        {message.text}
      </div>
      {message.isConfirmation && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
          <CheckCircle2 size={13} />
          {message.text}
        </div>
      )}
      {taskList?.length > 0 && <TaskSuggestions tasks={taskList} onDelete={onDeleteTask} />}
    </Motion.div>
  );
}
