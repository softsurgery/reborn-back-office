import { Card } from "@/components/ui/card";
import React from "react";
import { ConversationList } from "@/components/chat/conversation/ConversationList";

export const Conversations = () => {
  return (
    <Card className="flex flex-col overflow-auto mb-5 h-full">
      <ConversationList />
    </Card>
  );
};
