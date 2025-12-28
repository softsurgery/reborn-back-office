import React from "react";
import { ConversationList } from "@/components/chat/conversation/ConversationList";

export const Conversations = () => {
  return (
    <div
      className="flex flex-col flex-1 overflow-auto mb-5"
      style={{
        maxHeight: window.screen.height - 300,
      }}
    >
      <ConversationList />
    </div>
  );
};
