import React from "react";
import { Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationInputProps {
  className?: string;
  input: string;
  setInput: (text: string) => void;
  sendMessage: () => void;
}

export const ConversationInput = ({
  className,
  input,
  setInput,
  sendMessage,
}: ConversationInputProps) => {
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage();
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 flex items-end justify-between z-20",
        className
      )}
    >
      <div className="flex flex-row items-end justify-between bg-white px-3 py-3 rounded-2xl shadow-md flex-1 border border-gray-300">
        {/* Add Button */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-blue-200 rounded-lg"
          onClick={() => {}}
          aria-label="Add attachment"
        >
          <Plus size={20} />
        </button>

        {/* Text Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Aa"
          className="flex-1 mx-2 px-2 py-2 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          style={{ minHeight: 42, maxHeight: 120 }}
        />

        {/* Send Button */}
        <button
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg",
            input.trim() ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"
          )}
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
