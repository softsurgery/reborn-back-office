import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface InfiniteJobsProps {
  size?: number;
  search?: string;
  sortKey?: string;
  order?: boolean;
  enabled?: boolean;
}

export const useInfiniteJobs = ({
  size = 12,
  search = "",
  sortKey = "id",
  order = true,
  enabled = true,
}: InfiniteJobsProps = {}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-jobs", size, search, sortKey, order],
    queryFn: async ({ pageParam = 1 }) => {
      return api.job.findPaginated({
        page: pageParam.toString(),
        limit: size.toString(),
        sort: `${sortKey},${order ? "ASC" : "DESC"}`,
        search: search || "",
        join: "uploads.upload",
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNextPage ? Number(lastPage.meta.page) + 1 : undefined,
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
