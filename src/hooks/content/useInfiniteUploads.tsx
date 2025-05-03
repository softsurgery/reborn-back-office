import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface InfiniteUploadsProps {
  size?: number;
  search?: string;
  sortKey?: string;
  order?: "ASC" | "DESC";
  enabled?: boolean;
}

export const useInfiniteUploads = ({
  size = 12,
  search,
  sortKey,
  order,
  enabled = true,
}: InfiniteUploadsProps = {}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["uploads", search],
    queryFn: async ({ pageParam = 1 }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return api.admin.upload.findPaginated({
        page: pageParam.toString(),
        size: size.toString(),
        search: search || "",
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled,
  });

  return {
    data: data?.pages.flatMap((group) => group.data) || [],
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};
