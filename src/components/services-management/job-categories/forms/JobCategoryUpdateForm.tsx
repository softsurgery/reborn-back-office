import React from "react";
import { cn } from "@/lib/utils";
import { useJobCategoryStore } from "@/hooks/stores/useJobCategoryStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useUpdateJobCategoryFormStructure } from "./useUpdateJobCategoryFormStructure";
import { useTranslation } from "react-i18next";

interface JobCategoryFormProps {
  className?: string;
  jobCategoryCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const JobCategoryUpdateForm: React.FC<JobCategoryFormProps> = ({
  className,
  jobCategoryCallback,
  cancelCallback,
  isPending,
}) => {
  const jobCategoryStore = useJobCategoryStore();
  const { t: tCommon } = useTranslation("common");
  const { jobCategoryUpdateFormStructure } = useUpdateJobCategoryFormStructure({
    jobCategoryStore,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={jobCategoryUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            jobCategoryCallback?.();
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
