import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponseConversationDto, ResponseMessageDto } from "@/types";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import Image from "next/image";
import { formatMessageTime } from "@/lib/date.lib";

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
  const { t, i18n } = useTranslation("user-management");
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
      (p) => p.id !== userStore.response?.id,
    );
  }, [conversation, userStore.response?.id]);

  const { data: otherParticipantPicture } = useQuery({
    queryKey: ["picture", otherParticipant?.pictureId],
    queryFn: () => api.upload.getUploadById(otherParticipant?.pictureId!),
    enabled: !!otherParticipant?.pictureId,
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
        className,
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
              {lastMessage?.content ||
                t(
                  "userManagement.inspect.conversations.conversationItem.noMessagesYet",
                )}
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
