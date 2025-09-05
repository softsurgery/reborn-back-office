import React from "react";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useTranslation } from "react-i18next";
import { useCurrencies } from "@/hooks/content/useCurrencies";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { ServerErrorResponse, Upload } from "@/types";
import { toast } from "sonner";
import { defineStepper } from "@/components/ui/stepper";
import { Spinner } from "@/components/shared/Spinner";
import { updateJobSchema } from "@/types/validations/job.validation";
import { useUpdateJobFormStructure } from "./useUpdateJobFormStructure";
import { useJobTags } from "@/hooks/content/useJobTags";
import { useJobCategories } from "@/hooks/content/useJobCategories";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";

const steps = [
  { id: "general", title: "job.forms.generalInformationTitle" },
  { id: "detailed", title: "job.forms.detailedInformationTitle" },
];

const { Stepper } = defineStepper(...steps);

interface JobFormProps {
  className?: string;
  jobCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const JobUpdateForm: React.FC<JobFormProps> = ({
  className,
  jobCallback,
  cancelCallback,
  isPending,
}) => {
  const jobStore = useJobStore();
  const { t: tCommon } = useTranslation("common");
  const { t: tJob } = useTranslation("job");

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
  const { jobCategories, isFetchJobCategoriesPending } = useJobCategories();

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
      if (stepId === "detailed") {
        return true;
      }
      return true;
    },
    [jobStore]
  );

  const handleSubmit = () => {
    jobCallback?.();
  };

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
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
              handleSubmit();
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
                        structure={generalInformationUpdateFormStructure}
                      />
                    )}
                    {methods.current.id === "detailed" && (
                      <FormBuilder
                        structure={detailedInformationUpdateFormStructure}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-between gap-2 px-4 py-3 border-t">
                <Button
                  variant="secondary"
                  onClick={() => cancelCallback?.()}
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
                      <>
                        <Save /> {tCommon("common.buttons.update")}
                      </>
                    ) : (
                      <>
                        {tCommon("common.buttons.next")} <ArrowRight />
                      </>
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
