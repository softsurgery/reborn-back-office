import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useRegionCreateSheet } from "./modals/RegionCreateSheet";
import {
  CreateRegionDto,
  DataTableConfig,
  ResponseRegionDto,
  ServerErrorResponse,
  ServerResponse,
  UpdateRegionDto,
} from "@/types";
import { useRegionStore } from "@/hooks/stores/useRegionStore";
import { getRegionColumns } from "./columns";
import { toast } from "sonner";
import { regionSchema } from "@/types/validations/region.validation";
import { useRegionUpdateSheet } from "./modals/RegionUpdateSheet";
import { useRegionDeleteDialog } from "./modals/RegionDeleteDialog";
import { DataTable } from "@/components/shared/data-tables/data-table";

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
    sortKey: "id",
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
      api._public.region.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
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
    mutationFn: (region: CreateRegionDto) => api._public.region.create(region),
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
    mutationFn: (data: { id?: number; region: UpdateRegionDto }) =>
      api._public.region.update(data.id, data.region),
    onSuccess: () => {
      toast.success("Region Updated Successfully");
      refetchRegions();
      regionStore.reset();
      closeUpdateRegionSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteRegion, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api._public.region.remove(id),
    onSuccess: () => {
      toast.success("Region Deleted Successfully");
      regionStore.reset();
      refetchRegions();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreateSubmit = () => {
    const data = regionStore.createDto;
    createRegion(data);
  };

  const handleUpdateSubmit = () => {
    const data = regionStore.updateDto;
    updateRegion({ id: regionStore.response?.id, region: data });
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
    deleteRegion: () => deleteRegion(regionStore?.response?.id),
    isDeletePending: isDeletionPending,
  });

  const context: DataTableConfig<ResponseRegionDto> = {
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
    targetEntity: (region: ResponseRegionDto) => {
      regionStore.set("response", region);
      regionStore.set("updateDto", { label: region.label });
    },
  };

  const columns = getRegionColumns(context);

  const isPending =
    isRegionsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
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
