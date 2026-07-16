import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useServerImages } from "@/hooks/content/useServerImages";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useUi } from "@/contexts/UiContext";
import { useInfiniteJobs } from "@/hooks/content/useInfiniteJobs";
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
import { JobGridView } from "./views/JobGridView";
import {
  FloatingViewSwitcher,
  JobViewMode,
} from "./views/FloatingViewSwitcher";

interface JobPortalPorps {
  className?: string;
}

export const JobPortal = ({ className }: JobPortalPorps) => {
  const router = useRouter();
  const { t, ready } = useTranslation("job");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const { setScrollable, clearScrollable } = useUi();
  React.useEffect(() => {
    setRoutes?.([
      { title: t("job.intro"), href: "/services-management" },
      { title: t("job.introTitle"), href: "/services-management/jobs" },
    ]);
    setIntro?.(t("job.introTitle"), t("job.introDescription"));
    setFloating?.(
      <FloatingViewSwitcher
        viewMode={viewMode}
        onChange={handleViewModeChange}
      />,
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
      clearFloating?.();
      clearScrollable?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, ready]);

  const jobStore = useJobStore();

  const [viewMode, setViewMode] = React.useState<JobViewMode>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view") as JobViewMode;
      if (viewParam === "table" || viewParam === "grid") return viewParam;

      const saved = localStorage.getItem("jobs_view_mode") as JobViewMode;
      if (saved === "table" || saved === "grid") return saved;
    }
    return "table";
  });

  const handleViewModeChange = React.useCallback(
    (mode: JobViewMode) => {
      setViewMode(mode);
      if (typeof window !== "undefined") {
        localStorage.setItem("jobs_view_mode", mode);
      }
      if (router.isReady) {
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, view: mode },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router]
  );

  React.useEffect(() => {
    if (router.isReady) {
      const viewParam = router.query.view as JobViewMode;
      if (viewParam === "table" || viewParam === "grid") {
        if (viewParam !== viewMode) {
          setViewMode(viewParam);
          if (typeof window !== "undefined") {
            localStorage.setItem("jobs_view_mode", viewParam);
          }
        }
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, view: viewMode },
          },
          undefined,
          { shallow: true }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.view]);

  React.useEffect(() => {
    setFloating?.(
      <FloatingViewSwitcher
        viewMode={viewMode}
        onChange={handleViewModeChange}
      />,
    );
    return () => {
      clearFloating?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, handleViewModeChange]);

  React.useEffect(() => {
    if (viewMode === "grid") {
      setScrollable?.(true);
    } else {
      clearScrollable?.();
    }
  }, [viewMode, setScrollable, clearScrollable]);

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
        join: "uploads.upload",
      }),
    enabled: viewMode === "table",
  });

  const {
    data: infiniteJobsData,
    isPending: isInfinitePending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchInfiniteJobs,
  } = useInfiniteJobs({
    size: debouncedSize,
    search: debouncedSearchTerm,
    sortKey: debouncedSortDetails.sortKey,
    order: debouncedSortDetails.order,
    enabled: viewMode === "grid",
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
      refetchInfiniteJobs();
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
      refetchInfiniteJobs();
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
      refetchInfiniteJobs();
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

  const uploadIds = React.useMemo(() => {
    const uploads = Array.isArray(jobStore.updateDto?.uploads)
      ? jobStore.updateDto.uploads
      : [];
    return uploads.map((u) => u.uploadId);
  }, [jobStore.updateDto?.uploads]);

  const { uploads: imageUrls, isPending: isImagesPending } = useServerImages({
    ids: uploadIds,
    enabled: uploadIds.length > 0,
  });

  const images = React.useMemo(() => {
    if (uploadIds.length === 0 || isImagesPending) return undefined;
    const uploads = Array.isArray(jobStore.updateDto?.uploads)
      ? jobStore.updateDto.uploads
      : [];
    return uploads
      .map((upload, index) => {
        const url = imageUrls[index];
        if (!url) return null;
        const name =
          jobStore.response?.uploads.find(
            (ru) => ru.uploadId === upload.uploadId,
          )?.upload.filename || `image-${upload.uploadId}.png`;
        return {
          id: upload.uploadId.toString(),
          url,
          name,
          image: null,
          progress: 100,
        };
      })
      .filter(Boolean) as {
        id: string;
        url: string;
        name: string;
        image: any;
        progress: number;
      }[];
  }, [uploadIds, imageUrls, isImagesPending, jobStore.updateDto?.uploads, jobStore.response?.uploads]);

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

  const context: DataTableConfig<ResponseJobDto> = React.useMemo(
    () => ({
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
          currencyId: job.currencyId,
          categoryId: job.categoryId,
          style: job.style,
          difficulty: job.difficulty,
          uploads: uploads.map((upload) => ({
            id: upload.id,
            uploadId: upload.uploadId,
          })),
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      router,
      openCreateJobSheet,
      openUpdateJobSheet,
      openDeleteJobDialog,
      searchTerm,
      page,
      size,
      jobsResponse?.meta.pageCount,
      sortDetails.order,
      sortDetails.sortKey,
      jobStore,
    ],
  );

  const columns = useJobColumns(context);

  const isTablePending =
    isJobsPending || paging || resizing || searching || sorting;
  const isGridPending = isInfinitePending || searching || sorting;

  return (
    <div
      className={cn(
        "flex flex-col flex-1 relative",
        viewMode === "table" ? "overflow-hidden" : "",
        className,
      )}
    >
      {viewMode === "table" ? (
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={columns}
          data={jobs}
          context={context}
          isPending={isTablePending}
        />
      ) : (
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="flex-1 overflow-auto"
          columns={columns}
          data={jobs}
          context={context}
          isPending={isGridPending}
          customContent={
            <JobGridView
              className="flex flex-col flex-1"
              containerClassName="flex-1 pb-16"
              jobs={infiniteJobsData}
              context={context}
              isPending={isGridPending}
              footerPagination={false}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          }
        />
      )}
      {createJobSheet}
      {updateJobSheet}
      {deleteJobDialog}
    </div>
  );
};
