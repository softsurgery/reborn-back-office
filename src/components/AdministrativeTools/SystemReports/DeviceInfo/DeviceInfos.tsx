import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import ContentSection from "@/components/Common/ContentSection";
import { DataTable } from "./data-table/data-table";
import { getDeviceInfoColumns } from "./data-table/columns";
import { DeviceInfoActionsContext } from "./data-table/action-context";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { cn } from "@/lib/utils";
import { createSearchFilterExpression } from "@/lib/object.util";

interface DeviceInfosProps {
  className?: string;
}

export default function DeviceInfos({ className }: DeviceInfosProps) {
  //next-router
  const router = useRouter();

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Feedbacks Management" },
      { title: "DeviceInfos", href: "/feedbacks-management/deviceInfos" },
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
    sortKey: "model",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: deviceInfosResponse,
    isPending: isDeviceInfosPending,
    refetch: refetchDeviceInfos,
  } = useQuery({
    queryKey: [
      "deviceInfos",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.deviceInfo.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
      ),
  });

  const deviceInfos = React.useMemo(() => {
    if (!deviceInfosResponse) return [];
    return deviceInfosResponse.data;
  }, [deviceInfosResponse]);
  const context = {
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: deviceInfosResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending =
    isDeviceInfosPending || paging || resizing || searching || sorting;
  return (
    <DeviceInfoActionsContext.Provider value={context}>
      <ContentSection
        title="DeviceInfos"
        desc="DeviceInfos"
        className={cn("w-full", className)}
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getDeviceInfoColumns()}
          data={deviceInfos}
          isPending={isPending}
        />
      </ContentSection>
    </DeviceInfoActionsContext.Provider>
  );
}
