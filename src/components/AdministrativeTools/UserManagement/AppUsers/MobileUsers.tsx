import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/Common/Datatables/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { DataTableConfig } from "@/types";
import { MobileUser } from "@/types";
import { getMobileUserColumns } from "./columns";
import { Eye } from "lucide-react";

interface MobileUsersProps {
  className?: string;
}

export default function MobileUsers({ className }: MobileUsersProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management", href: "/user-management" },
      { title: "Mobile Users", href: "/user-management/mobile-users" },
    ]);
    setIntro?.("Mobile Users", "Visualization of the Mobile Users of the application");
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
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const { data: mobileUsersResponse, isPending: isMobileUsersPending } = useQuery({
    queryKey: [
      "mobileUsers",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.mobileUser.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const mobileUsers = React.useMemo(() => {
    if (!mobileUsersResponse) return [];
    return mobileUsersResponse.data;
  }, [mobileUsersResponse]);

  const context: DataTableConfig<MobileUser> = {
    singularName: "Mobile User",
    pluralName: "Mobile Users",

    createCallback: () => {},
    updateCallback: () => {},
    deleteCallback: () => {},
    page,
    size,
    totalPageCount: mobileUsersResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  };

  const columns = getMobileUserColumns(context);

  const isPending =
    isMobileUsersPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={mobileUsers}
        context={context}
        isPending={isPending}
      />
    </div>
  );
}
