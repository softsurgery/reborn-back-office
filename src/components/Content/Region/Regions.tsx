import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/Common/Datatables/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { DataTableConfig, Region } from "@/types";
import { Permission } from "@prisma/client";
import { getRegionColumns } from "./columns";

interface RegionsProps {
  className?: string;
}

export default function Regions({ className }: RegionsProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Content", href: "/content" },
      { title: "Regions", href: "/content/regions" },
    ]);
    setIntro?.(
      "Regions",
      "Visualization of the regions of the application"
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
    data: regionsResponse,
    isPending: isRegionsPending,
  } = useQuery({
    queryKey: [
      "regions",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.content.region.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const regions = React.useMemo(() => {
    if (!regionsResponse) return [];
    return regionsResponse.data;
  }, [regionsResponse]);

  const context: DataTableConfig<Region> = {
    singularName: "Region",
    pluralName: "Regions",
    page,
    size,
    totalPageCount: regionsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  }

  const columns = getRegionColumns(context);

  const isPending =
    isRegionsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 mx-5 lg:mx-10", className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={columns}
          data={regions}
          context={context}
          isPending={isPending}
        />
    </div>
  );
}
