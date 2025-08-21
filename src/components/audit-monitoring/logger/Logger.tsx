import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { ResponseLogDto } from "@/types";
import { getLoggerColumns } from "./columns";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";

interface LoggerProps {
  className?: string;
}

export const Logger = ({ className }: LoggerProps) => {
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Audit & Monitoring", href: "/audit-monitoring" },
      { title: "Logger", href: "/audit-monitoring/logger" },
    ]);
    setIntro?.(
      "Logs",
      "Monitor and analyze system activities, API calls, and user actions"
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

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
    order: false, // Default to DESC for logs (newest first)
    sortKey: "createdAt",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: logsResponse,
    isPending: isLogsPending,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: [
      "logs",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.logger.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const logs = React.useMemo(() => {
    if (!logsResponse) return [];
    return logsResponse.data;
  }, [logsResponse]);

  const context: DataTableConfig<ResponseLogDto> = {
    singularName: "Log Entry",
    pluralName: "Log Entries",
    page,
    size,
    totalPageCount: logsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  };

  const columns = getLoggerColumns(context);

  const isPending = isLogsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={logs}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};
