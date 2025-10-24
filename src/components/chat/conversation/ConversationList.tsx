import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { ResponseConversationDto, ResponseMessageDto, ResponseUserDto } from "@/types";
import ConversationItem from "./ConversationItem";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";

const Loader = () => (
  <div className="text-center py-4 text-[hsl(var(--muted-foreground)/0.8)]">
    Loading...
  </div>
);

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
  if (isYesterday) return `${t?.("yesterday") || "Yesterday"} at ${timeStr}`;
  if (isThisWeek)
    return `${date.toLocaleDateString(locale, { weekday: "long" })} at ${timeStr}`;
  return `${date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })} at ${timeStr}`;
};

export const ConversationList: React.FC = () => {
  const { t, i18n } = useTranslation("conversation"); // <- namespace "conversation"
  const userStore = useUserStore();
  const user = userStore.response;
  const [selectedConversation, setSelectedConversation] = useState<ResponseConversationDto | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-conversations", user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      return await api.chat.conversation.findPaginatedUserConversationsById({
        id: user.id,
        page: "1",
        limit: "50",
        join: "participants",
      });
    },
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ["conversation-messages", selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation?.id) return { data: [] };
      return await api.chat.message.findPaginatedConversationMessages(selectedConversation.id, {
        page: "1",
        limit: "50",
        sort: "createdAt",
      });
    },
    enabled: Boolean(selectedConversation?.id),
  });

  useEffect(() => {
    if (selectedConversation) refetchMessages();
  }, [selectedConversation, refetchMessages]);

  if (isLoading || !user) return <Loader />;
  if (isError)
    return (
      <div className="text-center py-4 text-red-400">
        {t("errorLoading") || "Error loading conversations."}
      </div>
    );

  const conversations: ResponseConversationDto[] = data?.data || [];

  const handleSelectConversation = (conversationId: number) => {
    const conversation = conversations.find((c) => c.id === conversationId) || null;
    setSelectedConversation(conversation);
  };

  const getUserDisplayName = (u?: ResponseUserDto) => {
    if (!u) return t("unknown") || "Unknown";
    return (u as any).displayName || (u as any).fullName || u.email?.split("@")[0] || t("unknown");
  };

  const getSenderName = (msg: ResponseMessageDto) => {
    if (msg.user) return getUserDisplayName(msg.user);
    const participant = selectedConversation?.participants?.find((p) => p.id === msg.userId);
    return participant ? getUserDisplayName(participant) : t("unknown");
  };

  const messages: ResponseMessageDto[] = messagesData?.data || [];

  return (
    <div className="flex h-full bg-[hsl(var(--background)/1)] text-[hsl(var(--foreground)/1)] rounded-lg overflow-hidden">
      {/* Sidebar Conversations */}
      <div className="w-1/3 border-r border-[hsl(var(--sidebar-border)/1)] bg-[hsl(var(--sidebar)/1)] overflow-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={handleSelectConversation}
          />
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--background)/1)]">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-[hsl(var(--sidebar-border)/1)] bg-[hsl(var(--sidebar)/1)] flex items-center">
              <h2 className="font-semibold text-[hsl(var(--foreground)/1)] text-lg">
                {selectedConversation.participants
                  ?.filter((p) => p.id !== user.id)
                  ?.map(getUserDisplayName)
                  ?.join(", ") || t("unknown")}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.userId === user.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isMine
                            ? "bg-[hsl(var(--primary)/1)] text-[hsl(var(--primary-foreground)/1)] rounded-br-none"
                            : "bg-[hsl(var(--card)/1)] text-[hsl(var(--card-foreground)/1)] rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isMine
                          ? "text-[hsl(var(--muted-foreground)/1)]"
                          : "text-[hsl(var(--muted-foreground)/0.8)]"
                      }`}>
                        {getSenderName(msg)} • {formatMessengerTime(msg.createdAt, i18n.language, t)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-[hsl(var(--muted-foreground)/0.8)] mt-10">
                  {t("noMessagesYet")}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[hsl(var(--muted-foreground)/0.8)]">
            {t("selectConversation")}
          </div>
        )}
      </div>
    </div>
  );
};
