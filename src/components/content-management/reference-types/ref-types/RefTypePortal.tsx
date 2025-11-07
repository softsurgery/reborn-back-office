import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIntro } from "@/contexts/IntroContext";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { useTranslation } from "react-i18next";
import {
  CreateRefTypeDto,
  ResponseRefTypeDto,
  ServerErrorResponse,
  UpdateRefTypeDto,
} from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { useRefTypeColumns } from "./useRefTypeColumns";
import { useRefTypeCreateSheet } from "./modals/RefTypeCreateSheet";
import { useRefTypeUpdateSheet } from "./modals/RefTypeUpdateSheet";
import { useRefTypeDeleteDialog } from "./modals/RefTypeDeleteDialog";

interface RefTypePortalProps {
  className?: string;
}

export const RefTypePortal = ({ className }: RefTypePortalProps) => {
  const { t, ready } = useTranslation("content-management");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      {
        title: "Content Management",
        href: "/content-management",
      },
      {
        title: t("refType.page.title"),
        href: "/content-management/reference-types",
      },
    ]);
    setIntro?.(t("refType.page.title"), t("refType.page.description"));
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [t, ready]);

  const referenceTypesStore = useReferenceTypesStore();

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
    data: refTypesResponse,
    isFetching: isRefTypesPending,
    refetch: refetchRefTypes,
  } = useQuery({
    queryKey: [
      "ref-types",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.refType.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const refTypes = React.useMemo(() => {
    if (!refTypesResponse) return [];
    return refTypesResponse.data;
  }, [refTypesResponse]);

  const { mutate: createRefType, isPending: isCreationPending } = useMutation({
    mutationFn: (refType: CreateRefTypeDto) =>
      api.admin.refType.create(refType),
    onSuccess: () => {
      toast(t("refType.messages.createSuccess"));
      refetchRefTypes();
      referenceTypesStore.reset();
      closeCreateRefTypeSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateRefType, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: number; refType?: UpdateRefTypeDto }) =>
      api.admin.refType.update(data.id, data.refType),
    onSuccess: () => {
      toast(t("refType.messages.updateSuccess"));
      refetchRefTypes();
      referenceTypesStore.reset();
      closeUpdateRefTypeSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteRefType, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.admin.refType.remove(id),
    onSuccess: () => {
      toast(t("refType.messages.deleteSuccess"));
      refetchRefTypes();
      referenceTypesStore.reset();
      closeDeleteRefTypeDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleCreateSubmit = () => {
    const data = referenceTypesStore.refTypeCreateDto;
    createRefType(data);
  };

  const handleUpdateSubmit = () => {
    const data = referenceTypesStore.refTypeUpdateDto;
    updateRefType({ id: referenceTypesStore.refType?.id, refType: data });
  };

  const {
    createRefTypeSheet,
    openCreateRefTypeSheet,
    closeCreateRefTypeSheet,
  } = useRefTypeCreateSheet({
    createRefType: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetRefType: () => referenceTypesStore.reset(),
  });

  const {
    updateRefTypeSheet,
    openUpdateRefTypeSheet,
    closeUpdateRefTypeSheet,
  } = useRefTypeUpdateSheet({
    updateRefType: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetRefType: () => referenceTypesStore.reset(),
  });

  const {
    deleteRefTypeDialog,
    openDeleteRefTypeDialog,
    closeDeleteRefTypeDialog,
  } = useRefTypeDeleteDialog({
    representation: referenceTypesStore.refType?.label,
    deleteRefType: () => deleteRefType(referenceTypesStore.refType?.id),
    isDeletionPending,
    resetRefType: () => referenceTypesStore.reset(),
  });

  const context: DataTableConfig<ResponseRefTypeDto> = {
    singularName: t("refType.singularName"),
    pluralName: t("refType.pluralName"),
    createCallback: openCreateRefTypeSheet,
    updateCallback: openUpdateRefTypeSheet,
    deleteCallback: openDeleteRefTypeDialog,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: refTypesResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (refType: ResponseRefTypeDto) => {
      referenceTypesStore.setNested("refType", refType);
      referenceTypesStore.set<UpdateRefTypeDto>("refTypeUpdateDto", {
        label: refType.label,
        description: refType.description,
      });
    },
  };

  const columns = useRefTypeColumns(context);

  const isPending =
    isRefTypesPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={refTypes}
        context={context}
        isPending={isPending}
      />
      {createRefTypeSheet}
      {updateRefTypeSheet}
      {deleteRefTypeDialog}
    </div>
  );
};
