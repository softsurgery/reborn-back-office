import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import ContentSection from "@/components/Common/ContentSection";
import { DataTable } from "./data-table/data-table";
import { getPermissionColumns } from "./data-table/columns";
import { PermissionActionsContext } from "./data-table/ActionContext";
import { usePermissionSeedDialog } from "./modal/PermissionSeedDialog";
import { toast } from "sonner";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { PERMISSION_FILTER_FIELDS } from "@/constants/permission.filter-fields";
import { cn } from "@/lib/utils";
import { createSearchFilterExpression } from "@/lib/object.util";

interface PermissionsProps {
  className?: string;
}

export default function Permissions({ className }: PermissionsProps) {
  //next-router
  const router = useRouter();

  // set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management" },
      { title: "Permissions", href: "/users-management/permissions" },
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
      api.permission.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        debouncedSearchTerm
          ? createSearchFilterExpression(
              PERMISSION_FILTER_FIELDS,
              "||$cont||",
              debouncedSearchTerm,
              ";"
            )
          : ""
      ),
  });

  const permissions = React.useMemo(() => {
    if (!permissionsResponse) return [];
    return permissionsResponse.data;
  }, [permissionsResponse]);

  const { mutate: seedPermission, isPending: isSeedingPending } = useMutation({
    mutationFn: () => api.permission.seed(),
    onSuccess: () => {
      toast("Permissions Seeding Successfully");
      refetchPermissions();
      closeSeedPermissionDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const {
    seedPermissionDialog,
    openSeedPermissionDialog,
    closeSeedPermissionDialog,
  } = usePermissionSeedDialog({
    seedPermission,
    isSeedingPending,
  });

  const context = {
    //search, filtering, sorting & paging
    openSeedPermissionDialog,
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: permissionsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending =
    isPermissionsPending || paging || resizing || searching || sorting;
  return (
    <PermissionActionsContext.Provider value={context}>
      <ContentSection
        title="Permissions"
        desc="Permissions"
        className={cn("w-full", className)}
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getPermissionColumns()}
          data={permissions}
          isPending={isPending}
        />
      </ContentSection>
      {seedPermissionDialog}
    </PermissionActionsContext.Provider>
  );
}
