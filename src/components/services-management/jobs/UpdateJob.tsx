"use client";

import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
import { JobUpdateForm } from "@/components/services-management/jobs/forms/JobUpdateForm";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { updateJobSchema } from "@/types/validations/job.validation";
import { UpdateJobDto, ResponseJobDto } from "@/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";

interface UpdateJobProps {
  id: string;
  className?: string;
}

export const UpdateJob = ({ id, className }: UpdateJobProps) => {
  const router = useRouter();
  const { t, ready } = useTranslation("job");
  const reset = useJobStore((state) => state.reset);
  const set = useJobStore((state) => state.set);
  const response = useJobStore((state) => state.response);
  const hasInitializedImages = useJobStore(
    (state) => state.hasInitializedImages,
  );
  const images = useJobStore((state) => state.images);
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    reset();
    return () => {
      reset();
    };
  }, [reset]);

  const routes = React.useMemo(
    () => [
      { title: "Services Management", href: "/services-management" },
      { title: "Jobs", href: "/services-management/jobs" },
      { title: `Update Job: ${response?.title || "Loading..."}` },
    ],
    [response?.title],
  );

  React.useEffect(() => {
    setRoutes?.(routes);
    setIntro?.(
      t("job.page.updateTitle", "Update job"),
      t(
        "job.page.updateDescription",
        "Update the job details and save changes.",
      ),
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [ready, routes, setRoutes, clearRoutes, setIntro, clearIntro, t]);

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery<ResponseJobDto>({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });

  const imagesQuery = useQuery({
    queryKey: ["job-images", id],
    queryFn: async () => {
      const uploads = job?.uploads ?? [];
      const blobs = await Promise.all(
        uploads.map(async (upload) => {
          const url = await api.upload.getUploadById(upload.uploadId);
          return {
            id: upload.uploadId.toString(),
            url,
            name: upload.upload.filename || `image-${upload.uploadId}.png`,
            image: null,
            progress: 100,
          };
        }),
      );
      return blobs;
    },
    enabled: Boolean(job?.uploads?.length),
    staleTime: Infinity,
  });

  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (job && !initialized.current) {
      set("response", job);
      set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
        tagIds: job.tags.map((tag) => tag.id),
        currencyId: job.currencyId,
        categoryId: job.categoryId,
        style: job.style,
        difficulty: job.difficulty,
        uploads: job.uploads.map((upload) => ({
          id: upload.id,
          uploadId: upload.uploadId,
        })),
      });
      initialized.current = true;
    }
  }, [job, set]);

  React.useEffect(() => {
    if (imagesQuery.data && !hasInitializedImages && images.length === 0) {
      set("images", imagesQuery.data);
      set("hasInitializedImages", true);
    }
  }, [imagesQuery.data, hasInitializedImages, images.length, set]);

  const updateDto = useJobStore((state) => state.updateDto);

  const { mutate: updateJob, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateJobDto) => api.job.update(id, data),
    onSuccess: () => {
      toast.success(t("job.toast.updated"));
      reset();
      router.push("/services-management/jobs");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? t("job.toast.updateError"));
    },
  });

  const handleUpdateSubmit = React.useCallback(() => {
    const data = updateDto;
    const result = updateJobSchema.safeParse(data);
    if (!result.success) {
      set("updateDtoErrors", result.error.flatten().fieldErrors);
      return;
    }
    updateJob(data);
  }, [updateJob, updateDto, set]);

  const handleCancel = React.useCallback(() => {
    reset();
    router.push("/services-management/jobs");
  }, [reset, router]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8",
          className,
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-200/80 px-6 py-5">
            <h1 className="text-2xl font-semibold text-slate-900">
              {t("job.page.updateTitle", "Update job")}
            </h1>
          </div>
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full ", className)}>
      <div className="overflow-hidden">
        <div>
          <JobUpdateForm
            jobCallback={handleUpdateSubmit}
            cancelCallback={handleCancel}
            isPending={isUpdatePending}
          />
        </div>
      </div>
    </div>
  );
};
