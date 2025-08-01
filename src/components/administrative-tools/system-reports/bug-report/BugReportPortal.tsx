import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBugColumns } from "./columns";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useBugStore } from "../../../../hooks/stores/useBugStore";
import { useBugDeleteDialog } from "./modals/BugDeleteDialog";
import { toast } from "sonner";
import { useIntro } from "@/contexts/IntroContext";
import { cn } from "@/lib/utils";

import { ResponseBugDto, DataTableConfig } from "@/types";
import { DataTable } from "@/components/shared/data-tables/data-table";

interface BugReportPortalProps {
  className?: string;
}

export default function BugReportPortal({ className }: BugReportPortalProps) {
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "System Reports", href: "/system-reports" },
      { title: "Bug", href: "/system-reports/bugs" },
    ]);
    setIntro?.(
      "Bugs",
      "Manage device information related to user-reported bugs to streamline issue diagnosis and resolution."
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const bugStore = useBugStore();
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(10);
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
      api.bug.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const bugs = React.useMemo(() => {
    if (!bugsResponse) return [];
    return bugsResponse.data;
  }, [bugsResponse]);

  const { mutate: deleteBug, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.bug.remove(id),
    onSuccess: () => {
      toast("Bug Deleted Successfully");
      refetchBugs();
      bugStore.reset();
      closeDeleteBugDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { deleteBugDialog, openDeleteBugDialog, closeDeleteBugDialog } =
    useBugDeleteDialog({
      bugMessage: bugStore.response?.title,
      deleteBug: () => deleteBug(bugStore.response?.id!),
      isDeletionPending,
      resetBug: () => bugStore.reset(),
    });

  const context: DataTableConfig<ResponseBugDto> = {
    pluralName: "Bugs",
    singularName: "Bug",
    deleteCallback: openDeleteBugDialog,
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
    targetEntity: (bug: ResponseBugDto) => bugStore.set("response", bug),
  };

  const columns = useBugColumns(context);

  const isPending = isBugsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={bugs}
        context={context}
        isPending={isPending}
      />
      {deleteBugDialog}
    </div>
  );
}
