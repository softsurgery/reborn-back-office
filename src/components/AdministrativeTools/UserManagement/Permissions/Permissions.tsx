import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/Common/Datatables/data-table";
import { getPermissionColumns } from "./data-table/columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { DataTableConfig } from "@/types";
import { Permission } from "@prisma/client";

interface PermissionsProps {
  className?: string;
}

export default function Permissions({ className }: PermissionsProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management", href: "/user-management" },
      { title: "Permission", href: "/user-management/permission" },
    ]);
    setIntro?.(
      "Permissions",
      "Visualization of the permissions of the application"
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

  const [size, setSize] = React.useState(5);
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
    data: permissionsResponse,
    isPending: isPermissionsPending,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: [
      "permissions",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.permission.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const permissions = React.useMemo(() => {
    if (!permissionsResponse) return [];
    return permissionsResponse.data;
  }, [permissionsResponse]);

  const context: DataTableConfig<Permission> = {
    singularName: "Permission",
    pluralName: "Permissions",
    page,
    size,
    totalPageCount: permissionsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  }

  const columns = getPermissionColumns(context);

  const isPending =
    isPermissionsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 mx-5 lg:mx-10", className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={columns}
          data={permissions}
          context={context}
          isPending={isPending}
        />
    </div>
  );
}
