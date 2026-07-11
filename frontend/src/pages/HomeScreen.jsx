import { useState, useEffect, useCallback } from "react";
import LevelCard from "../components/home/LevelCard.jsx";
import ActiveTasks from "../components/ActiveTasks.jsx";
import ChatPanel from "./ChatPanel.jsx";
import { api } from "../utils/api.js";

export default function HomeScreen({ onTokensChange }) {
  const [tokens, setTokens] = useState(0);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tasksRefresh, setTasksRefresh] = useState(0);

  const fetchTokens = useCallback(async () => {
    try {
      const data = await api.getScore();
      setTokens(data.total_points);
      onTokensChange?.(data.total_points);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setTokensLoading(false);
    }
  }, [onTokensChange]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleTasksAdded = () => {
    setTasksRefresh((prev) => prev + 1);
    fetchTokens();
  };

  return (
    <div className="flex flex-col gap-5">
      <LevelCard tokens={tokens} loading={tokensLoading} />
      <ActiveTasks onTaskComplete={fetchTokens} refreshTrigger={tasksRefresh} />
      <ChatPanel onTasksAdded={handleTasksAdded} />
    </div>
  );
}
