import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StablePressable } from "../shared/StablePressable";
import { UserEntry } from "./UserEntry";
import { Separator } from "../ui/separator";
import { ApplicationHeader } from "../shared/AppHeader";
import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ResponseConversationDto } from "@/types";
import { User, Bell } from "lucide-react";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { Spinner } from "../shared/Spinner";

interface ChatProps {
  className?: string;
}

export const Chat = ({ className }: ChatProps) => {
  const userStore = useUserStore();
  const user = React.useMemo(() => userStore.response, [userStore.response]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isConversationsPending,
  } = useInfiniteQuery<
    {
      data: ResponseConversationDto[];
      meta: { page: number; hasNextPage?: boolean };
    },
    unknown
  >({
    queryKey: ["conversations", user?.id],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      user?.id
        ? api.chat.conversation.findPaginatedUserConversationsById({
            id: user.id,
            page: String(pageParam),
            limit: "5",
          })
        : Promise.resolve({ data: [], meta: { page: 1, hasNextPage: false } }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: !!user?.id,
  });

  const conversations = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const isPending = isConversationsPending || isFetchingNextPage;

  const handleClickConversation = (id: number) => {
    console.log("Open conversation", id);
  };

  return (
    <div className={cn("flex flex-col flex-1 mx-2", className)}>
      <ApplicationHeader
        title="Messages"
        shortcuts={[
          { icon: User, onPress: () => console.log("Go to user space") },
          { icon: Bell, onPress: () => console.log("Go to notifications") },
        ]}
      />

      <div className="flex flex-col mt-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Recent Messages</span>
        </div>

        <Separator className="mt-2" />

        <div className="flex flex-col gap-2">
          {conversations.length > 0
            ? conversations.map((item: ResponseConversationDto) => {
                const otherUser = item.participants.find(
                  (u) => u.id !== user?.id,
                );

                const lastMessage = item.messages?.[0]?.content ?? "";
                const sentAt = item.messages?.[0]
                  ? format(item.messages[0].createdAt, "hh:mm a")
                  : "";

                return (
                  <StablePressable
                    key={item.id}
                    className="flex flex-col gap-2 py-2 cursor-pointer"
                    onPress={() => handleClickConversation(item.id)}
                  >
                    {otherUser && (
                      <UserEntry
                        user={otherUser}
                        lastMessage={lastMessage}
                        sentAt={sentAt}
                      />
                    )}
                  </StablePressable>
                );
              })
            : !isPending && (
                <div className="p-6 flex items-center justify-center">
                  <span className="text-gray-400">
                    No conversations available
                  </span>
                </div>
              )}
        </div>

        {isPending && <Spinner />}
        {!hasNextPage && conversations.length > 0 && (
          <div className="flex flex-row items-center justify-center gap-2 p-6">
            <span className="text-gray-400 text-lg font-thin">
              No more conversations
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
