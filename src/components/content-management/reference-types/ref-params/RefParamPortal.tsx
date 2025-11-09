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
  CreateRefParamDto,
  ResponseRefParamDto,
  ServerErrorResponse,
  UpdateRefParamDto,
} from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { useRefParamColumns } from "./useRefParamColumns";
import { useRefParamCreateSheet } from "./modals/RefParamCreateSheet";
import { useRefParamUpdateSheet } from "./modals/RefParamUpdateSheet";
import { useRefParamDeleteDialog } from "./modals/RefParamDeleteDialog";

interface RefParamPortalProps {
  className?: string;
}

export const RefParamPortal = ({ className }: RefParamPortalProps) => {
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
        title: t("refParam.page.title"),
        href: "/content-management/reference-types",
      },
    ]);
    setIntro?.(t("refParam.page.title"), t("refParam.page.description"));
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
    data: refParamsResponse,
    isFetching: isRefParamsPending,
    refetch: refetchRefParams,
  } = useQuery({
    queryKey: [
      "ref-params",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.refParam.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const refParams = React.useMemo(() => {
    if (!refParamsResponse) return [];
    return refParamsResponse.data;
  }, [refParamsResponse]);

  const { mutate: createRefParam, isPending: isCreationPending } = useMutation({
    mutationFn: (refParam: CreateRefParamDto) =>
      api.admin.refParam.create(refParam),
    onSuccess: () => {
      toast(t("refParam.messages.createSuccess"));
      refetchRefParams();
      referenceTypesStore.reset();
      closeCreateRefParamSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateRefParam, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: number; refParam?: UpdateRefParamDto }) =>
      api.admin.refParam.update(data.id, data.refParam),
    onSuccess: () => {
      toast(t("refParam.messages.updateSuccess"));
      refetchRefParams();
      referenceTypesStore.reset();
      closeUpdateRefParamSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteRefParam, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.admin.refParam.remove(id),
    onSuccess: () => {
      toast(t("refParam.messages.deleteSuccess"));
      refetchRefParams();
      referenceTypesStore.reset();
      closeDeleteRefParamDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleCreateSubmit = () => {
    const data = referenceTypesStore.refParamCreateDto;
    createRefParam(data);
  };

  const handleUpdateSubmit = () => {
    const data = referenceTypesStore.refParamUpdateDto;
    updateRefParam({ id: referenceTypesStore.refParam?.id, refParam: data });
  };

  const {
    createRefParamSheet,
    openCreateRefParamSheet,
    closeCreateRefParamSheet,
  } = useRefParamCreateSheet({
    createRefParam: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetRefParam: () => referenceTypesStore.reset(),
  });

  const {
    updateRefParamSheet,
    openUpdateRefParamSheet,
    closeUpdateRefParamSheet,
  } = useRefParamUpdateSheet({
    updateRefParam: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetRefParam: () => referenceTypesStore.reset(),
  });

  const {
    deleteRefParamDialog,
    openDeleteRefParamDialog,
    closeDeleteRefParamDialog,
  } = useRefParamDeleteDialog({
    representation: referenceTypesStore.refParam?.label,
    deleteRefParam: () => deleteRefParam(referenceTypesStore.refParam?.id),
    isDeletionPending,
    resetRefParam: () => referenceTypesStore.reset(),
  });

  const context: DataTableConfig<ResponseRefParamDto> = {
    singularName: t("refParam.singularName"),
    pluralName: t("refParam.pluralName"),
    createCallback: openCreateRefParamSheet,
    updateCallback: openUpdateRefParamSheet,
    deleteCallback: openDeleteRefParamDialog,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: refParamsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (refParam: ResponseRefParamDto) => {
      referenceTypesStore.setNested("refParam", refParam);
      referenceTypesStore.set<UpdateRefParamDto>("refParamUpdateDto", {
        label: refParam.label,
        description: refParam.description,
        refTypeId: refParam.refTypeId,
        extras: refParam.extras,
      });
    },
  };

  const columns = useRefParamColumns(context);

  const isPending =
    isRefParamsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={refParams}
        context={context}
        isPending={isPending}
      />
      {createRefParamSheet}
      {updateRefParamSheet}
      {deleteRefParamDialog}
    </div>
  );
};
