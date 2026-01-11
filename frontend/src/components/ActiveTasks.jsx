import { useState, useEffect } from 'react';
import Task from './Task';
import { api } from '../utils/api.js';

export default function ActiveTasks({ onTaskComplete }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.getResolutions();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await api.completeResolution(taskId);
      fetchTasks(); // Refresh tasks
      if (onTaskComplete) onTaskComplete(); // Refetch tokens in parent
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-left text-6xl text-white">Active Tasks</h1>
      {loading ? (
        <p className="text-left text-xl text-gray-300 mt-4">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-left text-xl text-gray-300 mt-4">One day or DAY ONE 😈😈😈😈</p>
      ) : (
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              pointValue={task.points}
              description={task.description}
              schedule={task.type}
              status={task.status}
              completedToday={task.completed_today}
              onComplete={handleTaskComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}