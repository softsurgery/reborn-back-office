import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { ResponseConversationDto, ResponseMessageDto } from "@/types";
import ConversationItem from "./ConversationItem";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";
import { identifyUser } from "@/lib/user.utils";
import { formatMessengerTime } from "@/lib/date.lib";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConversationListProps {
  className?: string;
}

export const ConversationList = ({ className }: ConversationListProps) => {
  const { t, i18n } = useTranslation("user-management");
  const userStore = useUserStore();
  const user = React.useMemo(() => userStore.response, [userStore.response]);

  const [selectedConversation, setSelectedConversation] =
    React.useState<ResponseConversationDto | null>(null);

  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

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
          sort: "createdAt,desc",
        }
      );
    },
    enabled: Boolean(selectedConversation?.id),
  });

  // Refetch messages when selecting a conversation
  React.useEffect(() => {
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
  React.useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

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
      <Card className="w-1/4 m-0">
        <CardHeader>
          <CardTitle>
            {/* need trans */}
            <span>Conversations</span>
          </CardTitle>
          <CardDescription>The user&apos;s conversations</CardDescription>
          <CardAction>
            <Button variant="ghost" size={"sm"} className="w-full">
              {/* need trans */}
              New conversation
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={handleSelectConversation}
            />
          ))}
        </CardContent>
      </Card>
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
