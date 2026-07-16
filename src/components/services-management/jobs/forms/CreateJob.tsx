"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { api } from "@/api";
import { CreateJobDto, ServerErrorResponse, Upload } from "@/types";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { useCreateJobFormStructure } from "./useCreateJobFormStructure";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { useCurrencies } from "@/hooks/content/useCurrencies";
import { useJobTags } from "@/hooks/content/useJobTags";
import { useJobCategories } from "@/hooks/content/useJobCategories";
import { createJobSchema } from "@/types/validations/job.validation";

const steps = [
  { id: "general", title: "job.forms.generalInformationTitle" },
  { id: "detailed", title: "job.forms.detailedInformationTitle" },
];

const { Stepper } = defineStepper(...steps);

export interface CreateJobProps {
  className?: string;
  createJob?: (job: CreateJobDto) => void;
  jobCallback?: () => void;
  isCreatePending?: boolean;
  isPending?: boolean;
  cancelCallback?: () => void;
}

export const CreateJob: React.FC<CreateJobProps> = ({
  className,
  createJob: propCreateJob,
  jobCallback,
  isCreatePending: propIsCreatePending,
  isPending: propIsPending,
  cancelCallback: propCancelCallback,
}) => {
  const { t: tCommon } = useTranslation("common");
  const { t: tJob, ready } = useTranslation("job");
  const jobStore = useJobStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCallback = React.useMemo(() => {
    return propCreateJob || (jobCallback ? () => jobCallback() : undefined);
  }, [propCreateJob, jobCallback]);
  const isCreatePending = propIsCreatePending ?? propIsPending;

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    if (!handleCallback) {
      jobStore.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCallback]);

  React.useEffect(() => {
    if (!handleCallback) {
      setRoutes?.([
        { title: tJob("job.intro"), href: "/services-management" },
        { title: tJob("job.introTitle"), href: "/services-management/jobs" },
        {
          title: tJob("job.sheet.createTitle"),
          href: "/services-management/jobs/create",
        },
      ]);
      setIntro?.(
        tJob("job.sheet.createTitle"),
        tJob("job.sheet.createDescription")
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [ready, tJob, handleCallback, clearIntro, clearRoutes, setIntro, setRoutes]);

  const { mutate: createJobMutation, isPending: isMutationPending } =
    useMutation({
      mutationFn: (job: CreateJobDto) => api.job.create(job),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["jobs"],
        });
        toast.success(tJob("job.toast.created"));
        jobStore.reset();
        router.push("/services-management/jobs");
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message ?? error.message ?? tCommon("common.error")
        );
      },
    });

  const isPending = isCreatePending ?? isMutationPending;

  const handleCreateSubmit = () => {
    if (handleCallback) {
      handleCallback(jobStore.createDto);
    } else {
      createJobMutation(jobStore.createDto);
    }
  };

  const handleCancel = () => {
    if (propCancelCallback) {
      propCancelCallback();
    } else {
      router.push("/services-management/jobs");
    }
  };

  const { currencies, isFetchCurrenciesPending } = useCurrencies();

  const { uploadFiles: uploadPicture } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      jobStore.appendUploadId("create", { uploadId: response?.[0]?.id });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const { jobTags, isFetchJobTagsPending } = useJobTags();
  const { jobCategories, isFetchJobCategoriesPending } = useJobCategories({});

  const {
    detailedInformationCreateFormStructure,
    generalInformationCreateFormStructure,
  } = useCreateJobFormStructure({
    jobStore,
    currencies,
    jobTags: mapToSelectOptions({
      data: isFetchJobTagsPending ? [] : jobTags,
      labelKey: "label",
      valueKey: "id",
    }),
    jobCategories: mapToSelectOptions({
      data: isFetchJobCategoriesPending ? [] : jobCategories,
      labelKey: "label",
      valueKey: "id",
    }),
    uploadPicture,
  });

  const validateStep = React.useCallback(
    (stepId: string) => {
      if (stepId === "general") {
        const jobResult = createJobSchema.safeParse(jobStore.createDto);
        if (!jobResult.success) {
          jobResult.error.errors.forEach((error) => {
            jobStore.setNested(`createDtoErrors.${error.path[0]}`, [
              error.message,
            ]);
          });
          return false;
        }
      }
      return true;
    },
    [jobStore]
  );

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <Stepper.Provider
        className="flex flex-col flex-1 overflow-hidden"
        variant="horizontal"
      >
        {({ methods }) => {
          const activeIndex = steps.findIndex(
            (step) => step.id === methods.current.id
          );

          const handleNext = () => {
            const valid = validateStep(methods.current.id);
            if (!valid) return;

            if (methods.isLast) {
              handleCreateSubmit();
            } else {
              methods.next();
            }
          };

          return (
            <>
              {/* Navigation */}
              <Stepper.Navigation className="flex-shrink-0">
                {methods.all.map((step, index) => (
                  <Stepper.Step
                    key={step.id}
                    of={step.id}
                    onClick={() => {
                      if (index > activeIndex) {
                        let valid = true;
                        for (let i = 0; i <= activeIndex; i++) {
                          valid = valid && validateStep(steps[i].id);
                        }
                        if (!valid) return;
                      }
                      methods.goTo(step.id);
                    }}
                    disabled={isPending}
                  >
                    <Stepper.Title>{tJob(step.title)}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Content */}
              {isFetchCurrenciesPending ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden mt-4">
                  <div className="flex-1 overflow-auto px-2">
                    {methods.current.id === "general" && (
                      <FormBuilder
                        structure={generalInformationCreateFormStructure}
                      />
                    )}
                    {methods.current.id === "detailed" && (
                      <FormBuilder
                        structure={detailedInformationCreateFormStructure}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-between gap-2 px-4 py-3 border-t">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  {tCommon("common.buttons.cancel")}
                </Button>

                <div className="flex items-center gap-2">
                  {!methods.isFirst && (
                    <Button
                      variant="outline"
                      onClick={methods.prev}
                      disabled={isPending}
                    >
                      <ArrowLeft /> {tCommon("common.buttons.previous")}
                    </Button>
                  )}

                  <Button onClick={handleNext} disabled={isPending}>
                    {methods.isLast ? (
                      <React.Fragment>
                        <Save /> {tCommon("common.buttons.save")}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {tCommon("common.buttons.next")} <ArrowRight />
                      </React.Fragment>
                    )}
                  </Button>
                </div>
              </Stepper.Controls>
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
};
