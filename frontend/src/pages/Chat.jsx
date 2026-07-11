import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Input } from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

export default function Chat({ onSend, disabled }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "" || disabled) return;
    onSend?.(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
        <Sparkles size={20} className="text-brand" />
        Add a goal. We'll give you tasks.
      </div>
      <p className="mb-2 text-sm text-muted">Be as vague or as specific as you want.</p>

      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="e.g. 'I wanna work out more', 'Learn to code'..."
          disabled={disabled}
        />
        <Button onClick={handleSend} disabled={disabled || !message.trim()} className="shrink-0">
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
}
