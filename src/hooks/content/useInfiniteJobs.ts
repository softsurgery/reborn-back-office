import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface InfiniteJobsProps {
  size?: number;
  search?: string;
  sortKey?: string;
  order?: boolean;
  enabled?: boolean;
  userId?: string;
  filter?: string;
}

export const useInfiniteJobs = ({
  size = 12,
  search = "",
  sortKey = "id",
  order = true,
  enabled = true,
  userId,
  filter = "",
}: InfiniteJobsProps = {}) => {
  const computedFilter = filter || (userId ? `postedById||$eq||${userId}` : "");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-jobs", size, search, sortKey, order, computedFilter],
    queryFn: async ({ pageParam = 1 }) => {
      return api.job.findPaginated({
        page: pageParam.toString(),
        limit: size.toString(),
        sort: `${sortKey},${order ? "ASC" : "DESC"}`,
        search: search || "",
        filter: computedFilter,
        join: "uploads.upload",
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      const { page, pageCount, hasNextPage } = lastPage.meta;
      if (hasNextPage === true) return Number(page) + 1;
      if (hasNextPage === false) return undefined;
      return Number(page) < Number(pageCount) ? Number(page) + 1 : undefined;
    },
    enabled,
  });

  return {
    data: data?.pages.flatMap((group) => group.data) || [],
    isPending,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};
