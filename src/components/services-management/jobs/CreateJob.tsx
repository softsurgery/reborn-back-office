"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
import { JobCreateForm } from "@/components/services-management/jobs/forms/JobCreateForm";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { createJobSchema } from "@/types/validations/job.validation";
import { CreateJobDto } from "@/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { cn } from "@/lib/utils";

interface CreateJobProps {
  className?: string;
}

export const CreateJob = ({ className }: CreateJobProps) => {
  const router = useRouter();
  const { t, ready } = useTranslation("job");
  const reset = useJobStore((state) => state.reset);
  const set = useJobStore((state) => state.set);
  const createDto = useJobStore((state) => state.createDto);
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
      { title: "Create Job", href: "/services-management/new-job" },
    ],
    [],
  );

  React.useEffect(() => {
    setRoutes?.(routes);
    setIntro?.(
      t("job.page.createTitle", "Create job"),
      t(
        "job.page.createDescription",
        "Publish a new job by filling in the required information.",
      ),
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [ready, routes, setRoutes, clearRoutes, setIntro, clearIntro, t]);

  const { mutate: createJob, isPending: isCreatePending } = useMutation({
    mutationFn: (job: CreateJobDto) => api.job.create(job),
    onSuccess: () => {
      toast.success(t("job.toast.created"));
      reset();
      router.push("/services-management/jobs");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? t("job.toast.createError"));
    },
  });

  const handleCreateSubmit = React.useCallback(() => {
    const data = createDto;
    const result = createJobSchema.safeParse(data);
    if (!result.success) {
      set("createDtoErrors", result.error.flatten().fieldErrors);
      return;
    }
    createJob(data);
  }, [createJob, createDto, set]);

  const handleCancel = React.useCallback(() => {
    reset();
    router.push("/services-management/jobs");
  }, [reset, router]);

  return (
    <div className={cn("mx-auto w-full lg:px-8", className)}>
      <div className="overflow-hidden rounded-3xl ">
        <div className="">
          <JobCreateForm
            jobCallback={handleCreateSubmit}
            cancelCallback={handleCancel}
            isPending={isCreatePending}
          />
        </div>
      </div>
    </div>
  );
};
