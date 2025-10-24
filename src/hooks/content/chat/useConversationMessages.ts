import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { QueryParams } from "@/types";

interface useConversationMessagesProps {
  id: number;
  query?: QueryParams;
}

export const useConversationMessages = ({
  id,
  query,
}: useConversationMessagesProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refecthMessages,
    isRefetching,
    isPending: isMessagesPending,
  } = useInfiniteQuery({
    queryKey: ["messages", id, query],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.chat.message.findPaginatedConversationMessages(id, {
        ...query,
        page: String(pageParam),
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const messages = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);
  
  return {
    messages,
    isMessagesPending,
    refecthMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  };
};
