import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useJobCreateSheet } from "./modals/JobCreateSheet";
import {
  CreateJobDto,
  DataTableConfig,
  ResponseJobDto,
  UpdateJobDto,
} from "@/types";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { toast } from "sonner";
import { useJobUpdateSheet } from "./modals/JobUpdateSheet";
import { useJobDeleteDialog } from "./modals/JobDeleteDialog";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { getJobColumns } from "./columns";

interface JobsProps {
  className?: string;
}

export default function Jobs({ className }: JobsProps) {
  //next-router
  const router = useRouter();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Content Management", href: "/content-management" },
      { title: "Jobs", href: "/content-management/jobs" },
    ]);
    setIntro?.("Jobs", "Visualization of the jobs of the application");
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const jobStore = useJobStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500,
  );

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500,
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
    data: jobsResponse,
    isFetching: isJobsPending,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: [
      "jobs",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.job.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const jobs = React.useMemo(() => {
    if (!jobsResponse) return [];
    return jobsResponse.data;
  }, [jobsResponse]);

  const { mutate: createJob, isPending: isCreationPending } = useMutation({
    mutationFn: (job: CreateJobDto) => api.job.create(job),
    onSuccess: () => {
      toast.success("Job Created Successfully");
      refetchJobs();
      jobStore.reset();
      closeCreateJobSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateJob, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; job: UpdateJobDto }) =>
      api.job.update(data.id, data.job),
    onSuccess: () => {
      toast.success("Job Updated Successfully");
      refetchJobs();
      jobStore.reset();
      closeUpdateJobSheet();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteJob, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.job.remove(id),
    onSuccess: () => {
      toast.success("Job Deleted Successfully");
      jobStore.reset();
      refetchJobs();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreateSubmit = () => {
    const data = jobStore.createDto;
    createJob(data);
  };

  const handleUpdateSubmit = () => {
    const data = jobStore.updateDto;
    updateJob({ id: jobStore.response?.id, job: data });
  };

  const { createJobSheet, openCreateJobSheet, closeCreateJobSheet } =
    useJobCreateSheet({
      createJob: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetJob: () => jobStore.reset(),
    });

  const { updateJobSheet, openUpdateJobSheet, closeUpdateJobSheet } =
    useJobUpdateSheet({
      updateJob: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetJob: () => jobStore.reset(),
    });

  const { deleteJobDialog, openDeleteJobDialog } = useJobDeleteDialog({
    deleteJob: () => deleteJob(jobStore?.response?.id),
    isDeletePending: isDeletionPending,
  });

  const context: DataTableConfig<ResponseJobDto> = {
    singularName: "Job",
    pluralName: "Jobs",
    createCallback: openCreateJobSheet,
    updateCallback: openUpdateJobSheet,
    deleteCallback: openDeleteJobDialog,
    // search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    size,
    totalPageCount: jobsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (job: ResponseJobDto) => {
      jobStore.set("response", job);
      jobStore.set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
      });
    },
  };

  const columns = getJobColumns(context);

  const isPending = isJobsPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={jobs}
        context={context}
        isPending={isPending}
      />
      {createJobSheet}
      {updateJobSheet}
      {deleteJobDialog}
    </div>
  );
}
