"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { api } from "@/api";
import { ServerErrorResponse, UpdateJobDto, Upload } from "@/types";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { useUpdateJobFormStructure } from "./useUpdateJobFormStructure";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { useCurrencies } from "@/hooks/content/useCurrencies";
import { useJobTags } from "@/hooks/content/useJobTags";
import { useJobCategories } from "@/hooks/content/useJobCategories";
import { updateJobSchema } from "@/types/validations/job.validation";
import { useServerImages } from "@/hooks/content/useServerImages";
import { LocationPickerMap } from "@/components/shared/maps/LocationPickerMap";

const steps = [
  { id: "general", title: "job.forms.generalInformationTitle" },
  { id: "detailed", title: "job.forms.detailedInformationTitle" },
  { id: "location", title: "job.forms.locationInformationTitle" },
];

const { Stepper } = defineStepper(...steps);

export interface UpdateJobProps {
  id?: string;
  className?: string;
  updateJob?: (job: UpdateJobDto) => void;
  jobCallback?: () => void;
  isUpdatePending?: boolean;
  isPending?: boolean;
  cancelCallback?: () => void;
}

export const UpdateJob: React.FC<UpdateJobProps> = ({
  id,
  className,
  updateJob: propUpdateJob,
  jobCallback,
  isUpdatePending: propIsUpdatePending,
  isPending: propIsPending,
  cancelCallback: propCancelCallback,
}) => {
  const { t: tCommon } = useTranslation("common");
  const { t: tJob, ready } = useTranslation("job");
  const jobStore = useJobStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCallback = React.useMemo(() => {
    return propUpdateJob || (jobCallback ? () => jobCallback() : undefined);
  }, [propUpdateJob, jobCallback]);
  const isUpdatePending = propIsUpdatePending ?? propIsPending;

  const { data: fetchedJob, isFetching: isFetchJobPending } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id as string),
    enabled: Boolean(id && !handleCallback),
  });

  const job =
    fetchedJob ||
    (id && jobStore.response?.id === id
      ? jobStore.response
      : jobStore.response);

  React.useEffect(() => {
    if (job) {
      const uploads = job.uploads
        ? [...job.uploads].sort((a, b) => a.order - b.order)
        : [];
      jobStore.set("response", job);
      jobStore.set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
        pricingType: job.pricingType,
        status: job.status,
        tagIds: job.tags ? job.tags.map((tag) => tag.id) : [],
        currencyId: job.currencyId,
        categoryId: job.categoryId,
        style: job.style,
        difficulty: job.difficulty,
        latitude: job.latitude,
        longitude: job.longitude,
        uploads: uploads.map((upload) => ({
          id: upload.id,
          uploadId: upload.uploadId,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    if (!handleCallback && id) {
      setRoutes?.([
        { title: tJob("job.intro"), href: "/services-management" },
        { title: tJob("job.introTitle"), href: "/services-management/jobs" },
        {
          title: tJob("job.sheet.updateTitle"),
          href: `/services-management/jobs/edit/${id}`,
        },
      ]);
      setIntro?.(
        tJob("job.sheet.updateTitle"),
        tJob("job.sheet.updateDescription"),
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [
    ready,
    tJob,
    id,
    handleCallback,
    clearIntro,
    clearRoutes,
    setIntro,
    setRoutes,
  ]);

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
  }, [
    uploadIds,
    imageUrls,
    isImagesPending,
    jobStore.updateDto?.uploads,
    jobStore.response?.uploads,
  ]);

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

  const { mutate: updateJobMutation, isPending: isMutationPending } =
    useMutation({
      mutationFn: (data: { id?: string; job: UpdateJobDto }) =>
        api.job.update(data.id, data.job),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["jobs"],
        });
        if (id) {
          queryClient.invalidateQueries({
            queryKey: ["job", id],
          });
        }
        toast.success(tJob("job.toast.updated"));
        jobStore.reset();
        router.push("/services-management/jobs");
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message ??
            error.message ??
            tCommon("common.error"),
        );
      },
    });

  const isPending = isUpdatePending ?? isMutationPending;

  const handleUpdateSubmit = () => {
    const data = jobStore.updateDto;
    const result = updateJobSchema.safeParse(data);
    if (!result.success) {
      jobStore.set("updateDtoErrors", result.error.flatten().fieldErrors);
      return;
    }

    if (handleCallback) {
      handleCallback(data);
    } else {
      updateJobMutation({ id: jobStore.response?.id || id, job: data });
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
      jobStore.appendUploadId("update", { uploadId: response?.[0]?.id });
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { jobTags, isFetchJobTagsPending } = useJobTags();
  const { jobCategories, isFetchJobCategoriesPending } = useJobCategories({});

  const {
    detailedInformationUpdateFormStructure,
    generalInformationUpdateFormStructure,
  } = useUpdateJobFormStructure({
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
        const jobResult = updateJobSchema.safeParse(jobStore.updateDto);
        if (!jobResult.success) {
          jobResult.error.errors.forEach((error) => {
            jobStore.setNested(`updateDtoErrors.${error.path[0]}`, [
              error.message,
            ]);
          });
          return false;
        }
      }
      return true;
    },
    [jobStore],
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
            (step) => step.id === methods.current.id,
          );

          const handleNext = () => {
            const valid = validateStep(methods.current.id);
            if (!valid) return;

            if (methods.isLast) {
              handleUpdateSubmit();
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
              {isFetchCurrenciesPending || (id && isFetchJobPending && !job) ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden mt-4">
                  <div className="flex-1 flex flex-col overflow-auto px-2">
                    {methods.current.id === "general" && (
                      <FormBuilder
                        structure={generalInformationUpdateFormStructure}
                      />
                    )}
                    {methods.current.id === "detailed" && (
                      <FormBuilder
                        structure={detailedInformationUpdateFormStructure}
                      />
                    )}
                    {methods.current.id === "location" && (
                      <LocationPickerMap
                        height={"fullscreen"}
                        latitude={jobStore.updateDto?.latitude}
                        longitude={jobStore.updateDto?.longitude}
                        onChange={({ latitude, longitude }) => {
                          jobStore.setNested("updateDto.latitude", latitude);
                          jobStore.setNested("updateDto.longitude", longitude);
                        }}
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
                        <Save /> {tCommon("common.buttons.update")}
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
