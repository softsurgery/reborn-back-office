import React from "react";
import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BugActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getBugColumns } from "./data-table/columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useBugManager } from "../../../../hooks/stores/useBugManager";
import { useBugDeleteDialog } from "./modals/BugDeleteDialog";
import { toast } from "sonner";
import { BUG_FILTER_FIELDS } from "@/constants/bug.filter-fields";
import { createSearchFilterExpression } from "@/lib/object.util";

export default function Bugs() {
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Feedbacks Management" },
      { title: "Bugs", href: "/feedbacks-management/bugs" },
    ]);
  }, []);

  const bugManager = useBugManager();
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
    data: bugsResponse,
    isFetching: isBugsPending,
    refetch: refetchBugs,
  } = useQuery({
    queryKey: [
      "bugs",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.bug.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        debouncedSearchTerm
          ? createSearchFilterExpression(
              BUG_FILTER_FIELDS,
              "||$cont||",
              debouncedSearchTerm,
              ";"
            )
          : ""
      ),
  });

  const bugs = React.useMemo(() => {
    if (!bugsResponse) return [];
    return bugsResponse.data;
  }, [bugsResponse]);

  const { mutate: deleteBug, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.admin.bug.remove(id),
    onSuccess: () => {
      toast("Bug Deleted Successfully");
      refetchBugs();
      bugManager.reset();
      closeDeleteBugDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { deleteBugDialog, openDeleteBugDialog, closeDeleteBugDialog } =
    useBugDeleteDialog({
      bugMessage: bugManager.title,
      deleteBug: () => deleteBug(bugManager.id!),
      isDeletionPending,
      resetBug: () => bugManager.reset(),
    });

  const context = {
    openDeleteBugDialog,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: bugsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending = isBugsPending || paging || resizing || searching || sorting;
  return (
    <BugActionsContext.Provider value={context}>
      <ContentSection
        title="Bugs"
        desc="Manage user bugs to improve the platform and overall experience."
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getBugColumns()}
          data={bugs}
          isPending={isPending}
        />
      </ContentSection>
      {deleteBugDialog}
    </BugActionsContext.Provider>
  );
}
