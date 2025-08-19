import React from "react";
import { cn } from "@/lib/utils";
import { useJobTagStore } from "@/hooks/stores/useJobTagStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useUpdateJobTagFormStructure } from "./useUpdateJobTagFormStructure";
import { useTranslation } from "react-i18next";

interface JobTagFormProps {
  className?: string;
  jobTagCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const JobTagUpdateForm: React.FC<JobTagFormProps> = ({
  className,
  jobTagCallback,
  cancelCallback,
  isPending,
}) => {
  const jobTagStore = useJobTagStore();
  const { t: tCommon } = useTranslation("common");
  const { jobTagUpdateFormStructure } = useUpdateJobTagFormStructure({
    jobTagStore,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={jobTagUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            jobTagCallback?.();
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
