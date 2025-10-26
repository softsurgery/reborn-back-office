import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponseConversationDto, ResponseMessageDto } from "@/types";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import Image from "next/image";

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
    return t ? t("conversationItem:yesterday") : "conversationItem:Yesterday";
  } else if (isThisWeek) {
    return date.toLocaleDateString(locale, { weekday: "long" });
  } else {
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

interface ConversationItemProps {
  className?: string;
  conversation: ResponseConversationDto;
  onClick?: (id: number) => void;
}

const ConversationItem = ({
  className,
  conversation,
  onClick,
}: ConversationItemProps) => {
  const { t, i18n } = useTranslation("conversation:conversationItem");
  const userStore = useUserStore();
  const { data: lastMessageData } = useQuery({
    queryKey: ["last-message", conversation.id],
    queryFn: () =>
      api.chat.message.findPaginatedConversationMessages(conversation.id, {
        page: "1",
        limit: "1",
        sort: "createdAt,DESC",
      }),
  });

  const otherParticipant = React.useMemo(() => {
    return conversation.participants?.find(
      (p) => p.id !== userStore.response?.id
    );
  }, [conversation, userStore.response?.id]);

  const { data: otherParticipantPicture } = useQuery({
    queryKey: ["picture", otherParticipant?.profile?.pictureId],
    queryFn: () =>
      api.upload.getUploadById(otherParticipant?.profile?.pictureId!),
    enabled: !!otherParticipant?.profile?.pictureId,
    staleTime: Infinity,
  });

  const identifier = React.useMemo(() => {
    return identifyUser(otherParticipant);
  }, [otherParticipant]);

  const fallback = React.useMemo(() => {
    return identifyUserAvatar(otherParticipant);
  }, [otherParticipant]);

  const lastMessage: ResponseMessageDto | undefined = React.useMemo(() => {
    return lastMessageData?.data[0];
  }, [lastMessageData]);

  const formattedTime = React.useMemo(() => {
    return formatMessageTime(lastMessage?.createdAt, i18n.language, t);
  }, [lastMessage]);

  if (!userStore.response?.id) return null;
  return (
    <div
      className={cn(
        "p-3 cursor-pointer flex items-center transition-colors",
        className
      )}
      onClick={() => onClick?.(conversation.id)}
    >
      <div className="flex items-center gap-3 w-full">
        <Image
          src={otherParticipantPicture as string}
          alt={fallback}
          className="rounded-full object-cover border"
          width={50}
          height={50}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold truncate">{identifier}</span>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm truncate max-w-[220px]">
              {lastMessage?.content || t("conversationItem:noMessagesYet")}
            </span>
            <span className="text-xs opacity-70 whitespace-nowrap ml-2">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
