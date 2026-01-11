import { useState, useRef, useEffect } from "react";
import Chat from "./Chat.jsx";
import ChatMessage from "../components/ChatMessage.jsx";
import { api } from "../utils/api.js";

export default function ChatPanel({ onTasksAdded }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});
  const messagesEndRef = useRef(null);

  const handleSend = async (msg) => {
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);
    setLoading(true);

    try {
      const result = await api.generateTasks(msg);
      
      if (result.success) {
        const messageId = Date.now();
        // Show AI response
        setMessages((prev) => [
          ...prev,
          { text: result.message, sender: "bot", tasks: result.tasks, messageId },
        ]);
        // Track suggested tasks for this message
        setSuggestedTasks((prev) => ({
          ...prev,
          [messageId]: result.tasks,
        }));
        // Initialize all as selected
        const taskSelection = {};
        result.tasks.forEach((task, idx) => {
          taskSelection[`${messageId}-${idx}`] = true;
        });
        setSelectedTasks((prev) => ({ ...prev, ...taskSelection }));
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Failed to generate tasks", sender: "bot" },
        ]);
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

  const handleDeleteTask = (messageId, taskIdx) => {
    setSuggestedTasks((prev) => ({
      ...prev,
      [messageId]: prev[messageId].filter((_, idx) => idx !== taskIdx),
    }));
    setSelectedTasks((prev) => {
      const newSelected = { ...prev };
      delete newSelected[`${messageId}-${taskIdx}`];
      return newSelected;
    });
  };

  const handleToggleTaskSelection = (taskKey) => {
    setSelectedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const handleAddSelectedTasks = (messageId) => {
    const selected = Object.entries(selectedTasks)
      .filter(([key, isSelected]) => key.startsWith(`${messageId}-`) && isSelected)
      .map(([key]) => {
        const taskIdx = parseInt(key.split("-")[1]);
        return suggestedTasks[messageId][taskIdx];
      });
    
    if (selected.length === 0) return;
    
    // Show confirmation message
    setMessages((prev) => [
      ...prev,
      { text: `Added ${selected.length} task(s) to your list!`, sender: "bot", isConfirmation: true },
    ]);
    
    // Trigger parent to refresh active tasks
    if (onTasksAdded) onTasksAdded();
  };

  const handleGenerateMore = async (lastPrompt) => {
    if (!lastPrompt) return;
    // Trigger a new generation with the same prompt
    handleSend(lastPrompt);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSuggestedTasks({});
    setSelectedTasks({});
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);
  
  useEffect(() => {
    setMessages([]);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center -mt-1 mb-20">
        <div className="p-4 border-gray-800">
            <Chat onSend={handleSend} />
        </div>
      <div className="flex-1 overflow-y-auto flex-col w-full h-[75vh] bg-gray-900 rounded-2xl shadow-lg">
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 mt-10">
          {messages.map((m, msgIdx) => {
            const messageId = m.messageId || msgIdx;
            const taskList = suggestedTasks[messageId] || m.tasks || [];
            
            return (
              <ChatMessage
                key={msgIdx}
                message={m}
                messageIdx={msgIdx}
                taskList={taskList}
                selectedTasks={selectedTasks}
                loading={loading}
                onToggleSelect={handleToggleTaskSelection}
                onDeleteTask={handleDeleteTask}
                onAddSelectedTasks={handleAddSelectedTasks}
                onGenerateMore={() => handleGenerateMore()}
              />
            );
          })}
          {loading && (
            <div className="px-4 py-2 rounded-xl max-w-[75%] bg-gray-700 text-white self-start">
              Generating tasks...
            </div>
          )}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-semibold self-center"
            >
              Clear Chat
            </button>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
