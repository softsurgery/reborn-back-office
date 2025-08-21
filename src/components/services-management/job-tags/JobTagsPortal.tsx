import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useJobTagCreateSheet } from "./modals/JobTagCreateSheet";
import { CreateJobTagDto, ResponseJobTagDto, UpdateJobTagDto } from "@/types";
import { useJobTagStore } from "@/hooks/stores/useJobTagStore";
import { getJobTagColumns } from "./columns";
import { toast } from "sonner";
import { useJobTagUpdateSheet } from "./modals/JobTagUpdateSheet";
import { useJobTagDeleteDialog } from "./modals/JobTagDeleteDialog";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";

interface JobTagsProps {
  className?: string;
}

export default function JobTagsPortal({ className }: JobTagsProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Services Management", href: "/services" },
      { title: "Job Tags", href: "/services-management/job-tags" },
    ]);
    setIntro?.("Job Tags", "Visualization of the job tags of the application");
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const jobTagStore = useJobTagStore();

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
    data: jobTagsResponse,
    isFetching: isJobTagsPending,
    refetch: refetchJobTags,
  } = useQuery({
    queryKey: [
      "jobTags",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.jobTag.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const jobTags = React.useMemo(() => {
    if (!jobTagsResponse) return [];
    return jobTagsResponse.data;
  }, [jobTagsResponse]);

  const { mutate: createJobTag, isPending: isCreationPending } = useMutation({
    mutationFn: (jobTag: CreateJobTagDto) => api.jobTag.create(jobTag),
    onSuccess: () => {
      toast.success("JobTag Created Successfully");
      refetchJobTags();
      jobTagStore.reset();
      closeCreateJobTagSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateJobTag, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: number; jobTag: UpdateJobTagDto }) =>
      api.jobTag.update(data.id, data.jobTag),
    onSuccess: () => {
      toast.success("JobTag Updated Successfully");
      refetchJobTags();
      jobTagStore.reset();
      closeUpdateJobTagSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteJobTag, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.jobTag.remove(id),
    onSuccess: () => {
      toast.success("JobTag Deleted Successfully");
      jobTagStore.reset();
      refetchJobTags();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreateSubmit = () => {
    const data = jobTagStore.createDto;
    createJobTag(data);
  };

  const handleUpdateSubmit = () => {
    const data = jobTagStore.updateDto;
    updateJobTag({ id: jobTagStore.response?.id, jobTag: data });
  };

  const { createJobTagSheet, openCreateJobTagSheet, closeCreateJobTagSheet } =
    useJobTagCreateSheet({
      createJobTag: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetJobTag: () => jobTagStore.reset(),
    });

  const { updateJobTagSheet, openUpdateJobTagSheet, closeUpdateJobTagSheet } =
    useJobTagUpdateSheet({
      updateJobTag: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetJobTag: () => jobTagStore.reset(),
    });

  const { deleteJobTagDialog, openDeleteJobTagDialog } = useJobTagDeleteDialog({
    deleteJobTag: () => deleteJobTag(jobTagStore?.response?.id),
    isDeletePending: isDeletionPending,
  });

  const context: DataTableConfig<ResponseJobTagDto> = {
    singularName: "JobTag",
    pluralName: "JobTags",
    createCallback: openCreateJobTagSheet,
    updateCallback: openUpdateJobTagSheet,
    deleteCallback: openDeleteJobTagDialog,
    // search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    size,
    totalPageCount: jobTagsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (jobTag: ResponseJobTagDto) => {
      jobTagStore.set("response", jobTag);
      jobTagStore.set("updateDto", { label: jobTag.label });
    },
  };

  const columns = getJobTagColumns(context);

  const isPending =
    isJobTagsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={jobTags}
        context={context}
        isPending={isPending}
      />
      {createJobTagSheet}
      {updateJobTagSheet}
      {deleteJobTagDialog}
    </div>
  );
}
