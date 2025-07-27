import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import { getDeviceInfoColumns } from "./columns";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { cn } from "@/lib/utils";
import { useIntro } from "@/contexts/IntroContext";
import { DataTable } from "@/components/shared/data-table";
import { DataTableConfig, DeviceInfo } from "@/types";

interface DeviceInfosProps {
  className?: string;
}

export default function DeviceInfos({ className }: DeviceInfosProps) {
  //next-router
  const router = useRouter();
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Feedbacks Management" },
      { title: "DeviceInfos", href: "/feedbacks-management/deviceInfos" },
    ]);
    setIntro?.(
      "DeviceInfos",
      "Manage device information associated with bugs and feedback to enhance debugging and platform optimization."
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
    sortKey: "model",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const { data: deviceInfosResponse, isPending: isDeviceInfosPending } =
    useQuery({
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
          }`
        ),
    });

  const deviceInfos = React.useMemo(() => {
    if (!deviceInfosResponse) return [];
    return deviceInfosResponse.data;
  }, [deviceInfosResponse]);

  const context: DataTableConfig<DeviceInfo> = {
    singularName: "Device Info",
    pluralName: "Device Infos",
    //search, filtering, sorting & paging
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
  const columns = getDeviceInfoColumns(context);

  const isPending =
    isDeviceInfosPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={deviceInfos}
        context={context}
        isPending={isPending}
      />
    </div>
  );
}
