import React from "react";
import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FeedbackActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getFeedbackColumns } from "./data-table/columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useFeedbackManager } from "./hooks/useFeedbackManager";
import { useFeedbackDeleteDialog } from "./modals/FeedbackDeleteDialog";
import { toast } from "sonner";
import { createSearchFilterExpression } from "@/lib/object.util";

export default function Feedbacks() {
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Feedbacks Management" },
      { title: "Feedbacks", href: "/feedbacks-management/Feedbacks" },
    ]);
  }, []);

  const feedbackManager = useFeedbackManager();
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
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: feedbacksResponse,
    isFetching: isFeedbacksPending,
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
      api.admin.feedback.findPaginated(
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

  const { mutate: deleteFeedback, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.admin.feedback.remove(id),
    onSuccess: () => {
      toast("Feedback Deleted Successfully");
      refetchFeedbacks();
      feedbackManager.reset();
      closeDeleteFeedbackDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const {
    deleteFeedbackDialog,
    openDeleteFeedbackDialog,
    closeDeleteFeedbackDialog,
  } = useFeedbackDeleteDialog({
    feedbackMessage: feedbackManager.message,
    deleteFeedback: () => deleteFeedback(feedbackManager.id!),
    isDeletionPending,
    resetFeedback: () => feedbackManager.reset(),
  });

  const context = {
    openDeleteFeedbackDialog,
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
        desc="Manage user feedback to improve the platform and overall experience."
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getFeedbackColumns()}
          data={feedbacks}
          isPending={isPending}
        />
      </ContentSection>
      {deleteFeedbackDialog}
    </FeedbackActionsContext.Provider>
  );
}
