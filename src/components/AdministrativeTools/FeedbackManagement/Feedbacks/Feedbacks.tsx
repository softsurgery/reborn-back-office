import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import ContentSection from "@/components/Common/ContentSection";
import { DataTable } from "./data-table/data-table";
import { getFeedbackColumns } from "./data-table/columns";
import { FeedbackActionsContext } from "./data-table/ActionContext";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { FEEDBACK_FILTER_FIELDS } from "@/constants/feedback.filter-fields";
import { cn } from "@/lib/utils";
import { createSearchFilterExpression } from "@/lib/object.util";

interface FeedbacksProps {
  className?: string;
}

export default function Feedbacks({ className }: FeedbacksProps) {
  //next-router
  const router = useRouter();

  // set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Feedback Management" },
      { title: "Feedbacks", href: "/feedbacks-management/feedbacks" },
    ]);
  }, []);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "message",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: feedbacksResponse,
    isPending: isFeedbacksPending,
    refetch: refetchFeedbacks,
  } = useQuery({
    queryKey: [
      "feedbacks",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.feedback.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        debouncedSearchTerm
          ? createSearchFilterExpression(
              FEEDBACK_FILTER_FIELDS,
              "||$cont||",
              debouncedSearchTerm,
              ";"
            )
          : ""
      ),
  });

  const feedbacks = React.useMemo(() => {
    if (!feedbacksResponse) return [];
    return feedbacksResponse.data;
  }, [feedbacksResponse]);

  const context = {
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: feedbacksResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending =
    isFeedbacksPending || paging || resizing || searching || sorting;
  return (
    <FeedbackActionsContext.Provider value={context}>
      <ContentSection
        title="Feedbacks"
        desc="Feedbacks"
        className={cn("w-full", className)}
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getFeedbackColumns()}
          data={feedbacks}
          isPending={isPending}
        />
      </ContentSection>
    </FeedbackActionsContext.Provider>
  );
}
