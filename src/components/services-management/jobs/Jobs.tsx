import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useJobCreateSheet } from "./modals/JobCreateSheet";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "@/types";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { toast } from "sonner";
import { useJobUpdateSheet } from "./modals/JobUpdateSheet";
import { useJobDeleteDialog } from "./modals/JobDeleteDialog";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { useJobColumns } from "./columns";
import {
  createJobSchema,
  updateJobSchema,
} from "@/types/validations/job.validation";
import { useTranslation } from "react-i18next";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useRouter } from "next/router";

interface JobsProps {
  className?: string;
}

export default function Jobs({ className }: JobsProps) {
  const router = useRouter();
  const { t, ready } = useTranslation("job");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: t("job.intro"), href: "/services-management" },
      { title: t("job.introTitle"), href: "/services-management/jobs" },
    ]);
    setIntro?.(t("job.introTitle"), t("job.introDescription"));
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [t, ready]);

  const jobStore = useJobStore();

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
        join: "uploads.upload",
      }),
  });

  const jobs = React.useMemo(() => {
    if (!jobsResponse) return [];
    return jobsResponse.data;
  }, [jobsResponse]);

  const { mutate: createJob, isPending: isCreationPending } = useMutation({
    mutationFn: (job: CreateJobDto) => api.job.create(job),
    onSuccess: () => {
      toast.success(t("job.toast.created"));
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
      toast.success(t("job.toast.updated"));
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
      toast.success(t("job.toast.deleted"));
      jobStore.reset();
      refetchJobs();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreateSubmit = () => {
    const data = jobStore.createDto;
    const result = createJobSchema.safeParse({ ...data });
    if (!result.success) {
      jobStore.set("createDtoErrors", result.error.flatten().fieldErrors);
      return;
    }
    createJob(data);
  };

  const handleUpdateSubmit = () => {
    const data = jobStore.updateDto;
    const result = updateJobSchema.safeParse({ ...data });

    if (!result.success) {
      jobStore.set("updateDtoErrors", result.error.flatten().fieldErrors);
      return;
    }
    updateJob({ id: jobStore.response?.id, job: data });
  };

  const { createJobSheet, openCreateJobSheet, closeCreateJobSheet } =
    useJobCreateSheet({
      createJob: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetJob: jobStore.reset,
    });

  const { updateJobSheet, openUpdateJobSheet, closeUpdateJobSheet } =
    useJobUpdateSheet({
      updateJob: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetJob: jobStore.reset,
    });

  const { deleteJobDialog, openDeleteJobDialog } = useJobDeleteDialog({
    deleteJob: () => deleteJob(jobStore?.response?.id),
    isDeletePending: isDeletionPending,
    representation: jobStore?.response?.title,
  });

  const { data: images } = useQuery({
    queryKey: ["job-images", jobStore.response?.uploads],
    queryFn: async () => {
      const uploads = Array.isArray(jobStore.updateDto?.uploads)
        ? jobStore.updateDto.uploads
        : [];
      const blobs = await Promise.all(
        uploads.map(async (upload) => {
          const name =
            jobStore.response?.uploads.find(
              (ru) => ru.uploadId === upload.uploadId
            )?.upload.filename || `image-${upload.uploadId}.png`;

          const url = await api.upload.getUploadById(upload.uploadId);
          return {
            id: upload.uploadId.toString(),
            url,
            name,
            image: null,
            progress: 100,
          };
        })
      );
      return blobs;
    },
    enabled:
      Array.isArray(jobStore.updateDto?.uploads) &&
      jobStore.updateDto.uploads.length > 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (
      images &&
      !jobStore.hasInitializedImages &&
      jobStore.images.length === 0
    ) {
      jobStore.set("images", images);
      jobStore.set("hasInitializedImages", true);
    }
  }, [images, jobStore.hasInitializedImages, jobStore]);

  const context: DataTableConfig<ResponseJobDto> = {
    singularName: `${t("job.singularName")}`,
    pluralName: `${t("job.pluralName")}`,
    inspectCallback: (entity: ResponseJobDto) => {
      router.push(`/services-management/jobs/${entity.id}`);
    },
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
      const uploads = job.uploads.sort((a, b) => a.order - b.order);
      jobStore.set("response", job);
      jobStore.set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
        tagIds: job.tags.map((tag) => tag.id),
        currencyId: job.currencyId.toString(),
        categoryId: job.categoryId,
        style: job.style,
        difficulty: job.difficulty,
        uploads: uploads.map((upload) => ({
          id: upload.id,
          uploadId: upload.uploadId,
        })),
      });
    },
  };

  const columns = useJobColumns(context);

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
