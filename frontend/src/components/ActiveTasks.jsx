import { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import Task from "./Task.jsx";
import Card from "./ui/Card.jsx";
import Skeleton from "./ui/Skeleton.jsx";
import Button from "./ui/Button.jsx";
import { api } from "../utils/api.js";

export default function ActiveTasks({ onTaskComplete, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      const data = await api.getResolutions();
      setTasks(data);
      setShowAll(false);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await api.completeResolution(taskId);
      fetchTasks();
      onTaskComplete?.();
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await api.deleteResolution(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => (a.completed_today ? 1 : 0) - (b.completed_today ? 1 : 0)
  );
  const displayedTasks = showAll ? sortedTasks : sortedTasks.slice(0, 5);
  const hasMore = sortedTasks.length > 5;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Active Tasks</h2>
        {!loading && tasks.length > 0 && (
          <span className="text-sm text-muted">
            {tasks.filter((t) => t.completed_today).length}/{tasks.length} done
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <ClipboardList size={32} className="text-muted" />
          <p className="font-medium text-muted">No tasks yet — one day or day one?</p>
          <p className="text-sm text-muted">Describe a goal below and let AI build your task list.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {displayedTasks.map((task) => (
              <Motion.div
                key={task.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Task
                  id={task.id}
                  title={task.title}
                  pointValue={task.points}
                  description={task.description}
                  schedule={task.type}
                  completedToday={task.completed_today}
                  onComplete={handleTaskComplete}
                  onDelete={handleTaskDelete}
                />
              </Motion.div>
            ))}
          </AnimatePresence>

          {hasMore && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)} className="mt-1">
              {showAll ? "Show less" : `Show all (${tasks.length})`}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
