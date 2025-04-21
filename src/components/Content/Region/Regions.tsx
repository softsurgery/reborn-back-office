import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/Common/Datatables/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { useRegionCreateSheet } from "./modals/RegionCreateSheet";
import { DataTableConfig, Region, ServerResponse } from "@/types";
import { useRegionStore } from "@/hooks/stores/useRegionStore";
import { getRegionColumns } from "./columns";
import { toast } from "sonner";
import { regionSchema } from "@/types/validations/region.validation";
import { useRegionUpdateSheet } from "./modals/RegionUpdateSheet";
import { useRegionDeleteDialog } from "./modals/RegionDeleteDialog";

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
    setIntro?.("Regions", "Visualization of the regions of the application");
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const regionStore = useRegionStore();

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
    isFetching: isRegionsPending,
    refetch: refetchRegions,
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

  const { mutate: createRegion, isPending: isCreationPending } = useMutation({
    mutationFn: (region: Partial<Region>) =>
      api.admin.content.region.create(region),
    onSuccess: () => {
      toast.success("Region Created Successfully");
      refetchRegions();
      regionStore.reset();
      closeCreateRegionSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateRegion, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: number; region: Partial<Region> }) =>
      api.admin.content.region.update(data.id, data.region),
    onSuccess: (response: ServerResponse<Region>) => {
      toast.success(response.message);
      refetchRegions();
      regionStore.reset();
      closeUpdateRegionSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteRegion, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.admin.content.region.remove(id),
    onSuccess: (response: ServerResponse<Region>) => {
      toast.success(response.message);
      regionStore.reset();
      refetchRegions();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreateSubmit = () => {
    const { id, ...data } = regionStore.getRegion();
    const result = regionSchema.safeParse(data);
    if (!result.success) {
      regionStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      createRegion(data);
    }
  };

  const handleUpdateSubmit = () => {
    const { id, ...data } = regionStore.getRegion();
    const result = regionSchema.safeParse(data);
    if (!result.success) {
      regionStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      updateRegion({ id, region: data });
    }
  };

  const { createRegionSheet, openCreateRegionSheet, closeCreateRegionSheet } =
    useRegionCreateSheet({
      createRegion: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetRegion: () => regionStore.reset(),
    });

  const { updateRegionSheet, openUpdateRegionSheet, closeUpdateRegionSheet } =
    useRegionUpdateSheet({
      updateRegion: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetRegion: () => regionStore.reset(),
    });

  const { deleteRegionDialog, openDeleteRegionDialog } = useRegionDeleteDialog({
    deleteRegion: () => deleteRegion(regionStore?.id),
    isDeletePending: isDeletionPending,
  });

  const context: DataTableConfig<Region> = {
    singularName: "Region",
    pluralName: "Regions",
    createCallback: openCreateRegionSheet,
    updateCallback: openUpdateRegionSheet,
    deleteCallback: openDeleteRegionDialog,
    // search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    size,
    totalPageCount: regionsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (region: Region) => regionStore.setRegion(region),
  };

  const columns = getRegionColumns(context);

  const isPending =
    isRegionsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={regions}
        context={context}
        isPending={isPending}
      />
      {createRegionSheet}
      {updateRegionSheet}
      {deleteRegionDialog}
    </div>
  );
}
