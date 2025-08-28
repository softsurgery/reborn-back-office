import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useJobCategoryCreateSheet } from "./modals/JobCategoryCreateSheet";
import { CreateJobCategoryDto, ResponseJobCategoryDto, UpdateJobCategoryDto } from "@/types";
import { useJobCategoryStore } from "@/hooks/stores/useJobCategoryStore";
import { useJobCategoryColumns } from "./columns";
import { toast } from "sonner";
import { useJobCategoryUpdateSheet } from "./modals/JobCategoryUpdateSheet";
import { useJobCategoryDeleteDialog } from "./modals/JobCategoryDeleteDialog";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useTranslation } from "react-i18next";

interface JobCategorysProps {
  className?: string;
}

export default function JobCategoriesPortal({ className }: JobCategorysProps) {
  const { t, ready } = useTranslation("job");
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: t("jobCategory.intro"), href: "/services-management" },
      {
        title: t("jobCategory.introTitle"),
        href: "/services-management/job-categories",
      },
    ]);
    setIntro?.(t("jobCategory.introTitle"), t("jobCategory.introDescription"));
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [t, ready]);

  const jobCategoryStore = useJobCategoryStore();

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
    data: jobCategorysResponse,
    isFetching: isJobCategorysPending,
    refetch: refetchJobCategorys,
  } = useQuery({
    queryKey: [
      "jobCategorys",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.jobCategory.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const jobCategorys = React.useMemo(() => {
    if (!jobCategorysResponse) return [];
    return jobCategorysResponse.data;
  }, [jobCategorysResponse]);

  const { mutate: createJobCategory, isPending: isCreationPending } =
    useMutation({
      mutationFn: (jobCategory: CreateJobCategoryDto) =>
        api.jobCategory.create(jobCategory),
      onSuccess: () => {
        toast.success(t("jobCategory.toast.created"));
        refetchJobCategorys();
        jobCategoryStore.reset();
        closeCreateJobCategorySheet();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateJobCategory, isPending: isUpdatePending } = useMutation(
    {
      mutationFn: (data: { id?: number; jobCategory: UpdateJobCategoryDto }) =>
        api.jobCategory.update(data.id, data.jobCategory),
      onSuccess: () => {
        toast.success(t("jobCategory.toast.updated"));
        refetchJobCategorys();
        jobCategoryStore.reset();
        closeUpdateJobCategorySheet();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const { mutate: deleteJobCategory, isPending: isDeletionPending } =
    useMutation({
      mutationFn: (id?: number) => api.jobCategory.remove(id),
      onSuccess: () => {
        toast.success(t("jobCategory.toast.deleted"));
        jobCategoryStore.reset();
        refetchJobCategorys();
      },
      onError: (error) => toast.error(error.message),
    });

  const handleCreateSubmit = () => {
    const data = jobCategoryStore.createDto;
    createJobCategory(data);
  };

  const handleUpdateSubmit = () => {
    const data = jobCategoryStore.updateDto;
    updateJobCategory({ id: jobCategoryStore.response?.id, jobCategory: data });
  };

  const {
    createJobCategorySheet,
    openCreateJobCategorySheet,
    closeCreateJobCategorySheet,
  } = useJobCategoryCreateSheet({
    createJobCategory: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetJobCategory: () => jobCategoryStore.reset(),
  });

  const {
    updateJobCategorySheet,
    openUpdateJobCategorySheet,
    closeUpdateJobCategorySheet,
  } = useJobCategoryUpdateSheet({
    updateJobCategory: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetJobCategory: () => jobCategoryStore.reset(),
  });

  const { deleteJobCategoryDialog, openDeleteJobCategoryDialog } =
    useJobCategoryDeleteDialog({
      deleteJobCategory: () =>
        deleteJobCategory(jobCategoryStore?.response?.id),
      isDeletePending: isDeletionPending,
    });

  const context: DataTableConfig<ResponseJobCategoryDto> = {
    singularName: `${t("jobCategory.singularName")}`,
    pluralName: `${t("jobCategory.pluralName")}`,
    createCallback: openCreateJobCategorySheet,
    updateCallback: openUpdateJobCategorySheet,
    deleteCallback: openDeleteJobCategoryDialog,
    // search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    size,
    totalPageCount: jobCategorysResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (jobCategory: ResponseJobCategoryDto) => {
      jobCategoryStore.set("response", jobCategory);
      jobCategoryStore.set("updateDto", { label: jobCategory.label });
    },
  };

  const columns = useJobCategoryColumns(context);

  const isPending =
    isJobCategorysPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={jobCategorys}
        context={context}
        isPending={isPending}
      />
      {createJobCategorySheet}
      {updateJobCategorySheet}
      {deleteJobCategoryDialog}
    </div>
  );
}
