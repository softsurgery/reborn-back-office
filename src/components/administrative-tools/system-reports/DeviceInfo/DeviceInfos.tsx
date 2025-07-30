import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { getDeviceInfoColumns } from "./columns";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { DataTableConfig, ResponseDeviceInfoDto } from "@/types";

interface DeviceInfosProps {
  className?: string;
}

export default function DeviceInfos({ className }: DeviceInfosProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      {
        title: "User Management",
        href: "/administrative-tools/user-management",
      },
      {
        title: "DeviceInfo",
        href: "/administrative-tools/user-management/deviceInfo",
      },
    ]);
    setIntro?.(
      "DeviceInfos",
      "Visualization of the deviceInfos of the application"
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
    order: true,
    sortKey: "label",
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
      api.admin.deviceInfo.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const deviceInfos = React.useMemo(() => {
    if (!deviceInfosResponse) return [];
    return deviceInfosResponse.data;
  }, [deviceInfosResponse]);

  const context: DataTableConfig<ResponseDeviceInfoDto> = {
    singularName: "DeviceInfo",
    pluralName: "DeviceInfos",
    page,
    size,
    totalPageCount: deviceInfosResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  };

  const columns = getDeviceInfoColumns(context);

  const isPending =
    isDeviceInfosPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={deviceInfos}
        context={context}
        isPending={isPending}
      />
    </div>
  );
}
