import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { ResponseConversationDto, ResponseMessageDto } from "@/types";
import ConversationItem from "./ConversationItem";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";
import { identifyUser } from "@/lib/user.utils";

const formatMessengerTime = (
  dateInput?: string | Date,
  locale?: string,
  t?: (key: string) => string
) => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const isThisWeek = date > weekAgo && !isToday && !isYesterday;

  const timeStr = date.toLocaleTimeString(locale || "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return timeStr;
  if (isYesterday)
    return `${t?.(
      "userManagement.inspect.conversations.conversationList.yesterday"
    ) || "Yesterday"} at ${timeStr}`;
  if (isThisWeek)
    return `${date.toLocaleDateString(locale, { weekday: "long" })} at ${timeStr}`;
  return `${date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })} at ${timeStr}`;
};

interface ConversationListProps {
  className?: string;
}

export const ConversationList = ({ className }: ConversationListProps) => {
  const { t, i18n } = useTranslation("user-management");
  const userStore = useUserStore();
  const user = React.useMemo(() => userStore.response, [userStore.response]);

  const [selectedConversation, setSelectedConversation] =
    React.useState<ResponseConversationDto | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-conversations", user?.id],
    queryFn: async () => {
      return await api.chat.conversation.findPaginatedUserConversationsById({
        id: user?.id,
        page: "1",
        limit: "50",
        join: "participants",
      });
    },
    enabled: !!user?.id,
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ["conversation-messages", selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation?.id) return { data: [] };
      return await api.chat.message.findPaginatedConversationMessages(
        selectedConversation.id,
        {
          page: "1",
          limit: "50",
          sort: "createdAt",
        }
      );
    },
    enabled: Boolean(selectedConversation?.id),
  });

  // Refetch messages when selecting a conversation
  useEffect(() => {
    if (selectedConversation) refetchMessages();
  }, [selectedConversation, refetchMessages]);

  const conversations: ResponseConversationDto[] = data?.data || [];
  const messages: ResponseMessageDto[] = messagesData?.data || [];

  const handleSelectConversation = (conversationId: number) => {
    const conversation =
      conversations.find((c) => c.id === conversationId) || null;
    setSelectedConversation(conversation);
  };

  const getSenderName = (msg: ResponseMessageDto) => {
    if (msg.user) return identifyUser(msg.user);
    const participant = selectedConversation?.participants?.find(
      (p) => p.id === msg.userId
    );
    return participant
      ? identifyUser(participant)
      : t("userManagement.inspect.conversations.conversationList.unknown");
  };

  // Auto-scroll only if user is near bottom
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (isLoading || !user) return <Spinner />;
  if (isError)
    return (
      <div className="text-center py-4 text-red-400">
        {t(
          "userManagement.inspect.conversations.conversationList.errorLoading"
        ) || "Error loading conversations."}
      </div>
    );

  return (
    <div className={cn("flex h-full rounded-lg overflow-hidden", className)}>
      {/* Sidebar Conversations */}
      <div className="w-1/3 border-r overflow-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={handleSelectConversation}
          />
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center">
              <h2 className="font-semibold text-lg">
                {selectedConversation.participants
                  ?.filter((p) => p.id !== user.id)
                  ?.map(identifyUser)
                  ?.join(", ") ||
                  t(
                    "userManagement.inspect.conversations.conversationList.unknown"
                  )}
              </h2>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto flex flex-col-reverse space-y-3 space-y-reverse"
            >
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.userId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col",
                        isMine ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2 rounded-2xl text-sm",
                          isMine
                            ? "rounded-br-none bg-primary"
                            : "rounded-bl-none bg-secondary"
                        )}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-1",
                          !isMine && "text-foreground/75"
                        )}
                      >
                        {getSenderName(msg)} •{" "}
                        {formatMessengerTime(msg.createdAt, i18n.language, t)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center mt-10">
                  {t(
                    "userManagement.inspect.conversations.conversationList.noMessagesYet"
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            {t(
              "userManagement.inspect.conversations.conversationList.selectConversation"
            )}
          </div>
        )}
      </div>
    </div>
  );
};
