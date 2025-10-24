import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponseConversationDto, ResponseMessageDto } from "@/types";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import { useTranslation } from "react-i18next";

const StablePressable: React.FC<{
  className?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  children?: React.ReactNode;
}> = ({ className, onPress, onPressIn, onPressOut, children }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPress?.();
    }
  };

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={() => onPress?.()}
      onMouseDown={() => onPressIn?.()}
      onMouseUp={() => onPressOut?.()}
      onMouseLeave={() => onPressOut?.()}
      onKeyPress={handleKeyPress}
    >
      {children}
    </div>
  );
};

const formatMessageTime = (
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

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isYesterday) {
    return t ? t("yesterday") : "Yesterday";
  } else if (isThisWeek) {
    return date.toLocaleDateString(locale, { weekday: "long" });
  } else {
    return date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  }
};

interface ConversationItemProps {
  conversation: ResponseConversationDto;
  onClick?: (id: number) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick }) => {
  const { t, i18n } = useTranslation("conversation");
  const [isPressed, setIsPressed] = useState(false);
  const userStore = useUserStore();
  const currentUserId = userStore.response?.id;
  if (!currentUserId) return null;

  const { data: lastMessageData } = useQuery({
    queryKey: ["last-message", conversation.id],
    queryFn: () =>
      api.chat.message.findPaginatedConversationMessages(conversation.id, {
        page: "1",
        limit: "1",
        sort: "-createdAt",
      }),
    staleTime: 60_000,
  });

  const lastMessage: ResponseMessageDto | undefined = lastMessageData?.data[0];
  const formattedTime = formatMessageTime(lastMessage?.createdAt, i18n.language, t);

  const otherParticipant = conversation.participants?.find(p => p.id !== currentUserId);
  const name =
    (otherParticipant as any)?.displayName ||
    (otherParticipant as any)?.fullName ||
    otherParticipant?.email?.split("@")[0] ||
    t("unknown");
  const avatarUrl = (otherParticipant as any)?.profilePicture || "/default-avatar.png";

  return (
    <StablePressable
      className={`p-3 cursor-pointer flex items-center transition-colors ${
        isPressed ? "bg-[hsl(var(--muted)/1)]" : "hover:bg-[hsl(var(--muted)/0.8)]"
      }`}
      onPress={() => onClick?.(conversation.id)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <div className="flex items-center gap-3 w-full">
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border border-[hsl(var(--border)/1)]"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold truncate text-[hsl(var(--foreground)/1)]">{name}</span>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-[hsl(var(--muted-foreground)/1)] truncate max-w-[220px]">
              {lastMessage?.content || t("noMessagesYet")}
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground)/0.8)] whitespace-nowrap ml-2">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </StablePressable>
  );
};

export default ConversationItem;
