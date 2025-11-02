import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotificationColumns } from "./columns";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useTranslation } from "react-i18next";
import { ResponseNotificationDto } from "@/types/notifications";

interface NotifcationsProps {
  className?: string;
  userId: string;
}

export const Notifications = ({ className, userId }: NotifcationsProps) => {
  const { t } = useTranslation("notifications");

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
    data: notificationsResponse,
    isPending: isNotificationsPending,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: [
      "notifications",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.notification.findPaginatedByUser(userId, {
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const notifications = React.useMemo(() => {
    if (!notificationsResponse) return [];
    return notificationsResponse.data;
  }, [notificationsResponse]);

  const context: DataTableConfig<ResponseNotificationDto> = {
    singularName: t("notifications.singular"),
    pluralName: t("notifications.plural"),
    page,
    size,
    totalPageCount: notificationsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  };

  const columns = useNotificationColumns(context);

  const isPending =
    isNotificationsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={notifications}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};
