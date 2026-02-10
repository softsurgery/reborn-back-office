import React from "react";
import { format } from "date-fns";
import { ChatHeaderLeft } from "./conversation/ChatHeaderLeft";
import { ChatHeaderRight } from "./conversation/ChatHeaderRight";
import { ChatBubble } from "./conversation/ChatBubble";
import { ConversationInput } from "./conversation/ConversationInput";
import { Loader } from "../shared/Loader";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ResponseConversationDto, ResponseMessageDto, Upload } from "@/types";

interface ConversationProps {
  id: number;
}

export const Conversation = ({ id }: ConversationProps) => {
  const { user } = useCurrentUser();
  const [messages, setMessages] = React.useState<ResponseMessageDto[]>([]);
  const [input, setInput] = React.useState("");
  const [loadingMore, setLoadingMore] = React.useState(false);

  const { data: conversation, isPending: isConversationLoading } =
    useQuery<ResponseConversationDto>({
      queryKey: ["conversation", id],
      queryFn: () => api.chat.conversation.findById(id),
    });

  const otherUser = React.useMemo(() => {
    return conversation?.participants.find((p) => p.id !== user?.id);
  }, [conversation, user]);

  // Group messages by day
  const groupedMessages = React.useMemo(() => {
    if (!messages) return [];
    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const groups: { date: string; messages: ResponseMessageDto[] }[] = [];
    let currentDate = "";
    let currentGroup: ResponseMessageDto[] = [];

    sorted.forEach((msg) => {
      const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (dateKey !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = dateKey;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });
    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }
    return groups;
  }, [messages]);

  // Fonction pour récupérer l'URL de l'image si elle existe
  const getProfilePictureUrl = (picture?: Upload) => {
    if (!picture) return undefined;
    // adapter ici selon ton backend
    return `/uploads/${picture.filename}`;
  };

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !user || !conversation) return;

    const newMsg: ResponseMessageDto = {
      id: Date.now(),
      content: input,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      userId: user.id,
      conversationId: id,
      isDeletionRestricted: false,
      conversation: conversation, // plus de null possible
      user: user,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Optionnel : envoyer au serveur
    // api.chat.message.send(newMsg).then(...);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 p-2">
        <ChatHeaderLeft
          profilePicture={getProfilePictureUrl(otherUser?.picture)}
          identifier={otherUser?.firstName}
          lastSeen={format(new Date(), "hh:mm a")}
        />
        <ChatHeaderRight />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {isConversationLoading ? (
          <Loader isPending={true} />
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="text-center text-xs text-gray-500 my-2">
                {group.date}
              </div>
              {group.messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.content}
                  timestamp={msg.createdAt}
                  right={msg.userId === user?.id}
                />
              ))}
            </div>
          ))
        )}
        {loadingMore && <Loader isPending={true} />}
      </div>

      {/* Input */}
      <div className="p-2 border-t">
        <ConversationInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};
