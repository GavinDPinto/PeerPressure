import { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import Chat from "./Chat.jsx";
import ChatMessage from "../components/ChatMessage.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { api } from "../utils/api.js";

export default function ChatPanel({ onTasksAdded }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async (msg) => {
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);
    setLoading(true);

    try {
      const result = await api.generateTasks(msg);

      if (result.success) {
        const messageId = Date.now();
        // The backend saves generated tasks immediately, so these are
        // already part of the user's active list.
        setMessages((prev) => [
          ...prev,
          { text: result.message, sender: "bot", tasks: result.tasks, messageId },
        ]);
        onTasksAdded?.();
      } else {
        setMessages((prev) => [...prev, { text: "Failed to generate tasks", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${error.message || "Could not generate tasks"}`, sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (messageId, taskId) => {
    try {
      await api.deleteResolution(taskId);
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId
            ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
            : m
        )
      );
      onTasksAdded?.();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleClearChat = () => setMessages([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="p-5">
        <Chat onSend={handleSend} disabled={loading} />
      </Card>

      {(messages.length > 0 || loading) && (
        <Card className="flex max-h-128 flex-col overflow-y-auto p-4">
          <div className="flex flex-1 flex-col gap-3">
            {messages.map((m, idx) => (
              <ChatMessage
                key={idx}
                message={m}
                taskList={m.tasks}
                onDeleteTask={(taskId) => handleDeleteTask(m.messageId, taskId)}
              />
            ))}
            {loading && (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 self-start rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-muted"
              >
                <Spinner size={15} /> Generating tasks...
              </Motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="mt-3 self-center"
            >
              Clear chat
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
