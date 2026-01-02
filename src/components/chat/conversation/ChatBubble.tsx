import { format } from "date-fns";
import React from "react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message?: string;
  timestamp: Date;
  right?: boolean;
  isPending?: boolean;
}

export const ChatBubble = ({
  message,
  timestamp,
  right,
  isPending,
}: ChatBubbleProps) => {
  const handleLongPress = () => {
    const action = window.confirm(
      `Message Options:\n\n${message}\n\nPress OK to copy, Cancel to ignore.`
    );
    if (action) {
      navigator.clipboard.writeText(message || "");
      alert("Copied to clipboard!");
    }
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      className={cn(
        "max-w-[80%] mx-2 rounded-lg mt-2 p-2 cursor-pointer select-none",
        right
          ? "self-end rounded-bl-xl rounded-br-none bg-gray-300"
          : "self-start rounded-br-xl rounded-bl-none bg-blue-200"
      )}
    >
      <div className="font-semibold">{message}</div>
      <div className="text-xs text-right text-gray-500">
        {format(timestamp, "hh:mm a")}
      </div>
    </div>
  );
};
