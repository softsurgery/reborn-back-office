import React from "react";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useTranslation } from "react-i18next";
import { useCreateJobFormStructure } from "./useCreateJobFormStructure";
import { useCurrencies } from "@/hooks/content/useCurrencies";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { Upload } from "@/types";
import { toast } from "sonner";

interface JobFormProps {
  className?: string;
  jobCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const JobCreateForm: React.FC<JobFormProps> = ({
  className,
  jobCallback,
  cancelCallback,
  isPending,
}) => {
  const jobStore = useJobStore();
  const { t: tCommon } = useTranslation("common");

  const { currencies, isFetchCurrenciesPending } = useCurrencies();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      jobStore.appendUploadId("create", { uploadId: response?.[0]?.id });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const { jobCreateFormStructure } = useCreateJobFormStructure({
    jobStore,
    currencies,
    uploadPicture,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="flex flex-col flex-1 overflow-auto no-scrollbar h-full px-1"
        structure={jobCreateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            jobCallback?.();
            // console.log(jobStore.createDto);
            // console.log(jobStore.images);
            // console.log(jobStore.createDto.uploads);
          }}
          disabled={isPending}
        >
          <Save className="mr-2" />
          {tCommon("common.buttons.save")}
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            cancelCallback?.();
          }}
          disabled={isPending}
        >
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    </div>
  );
};
