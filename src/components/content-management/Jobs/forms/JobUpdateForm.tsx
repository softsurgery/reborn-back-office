import React from "react";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/hooks/stores/useJobStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useUpdateJobFormStructure } from "./useUpdateJobFormStructure";
import { useTranslation } from "react-i18next";

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
  const { jobUpdateFormStructure } = useUpdateJobFormStructure({
    jobStore,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={jobUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            jobCallback?.();
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
