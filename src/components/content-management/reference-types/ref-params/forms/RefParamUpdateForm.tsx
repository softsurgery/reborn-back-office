import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { useUpdateRefParamFormStructure } from "./useUpdateRefParamFormStructure";
import { useRefTypes } from "@/hooks/content/reference-types/useRefTypes";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";

interface RefParamUpdateFormProps {
  className?: string;
  refParamCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RefParamUpdateForm = ({
  className,
  refParamCallback,
  cancelCallback,
  isPending,
}: RefParamUpdateFormProps) => {
  const referenceTypesStore = useReferenceTypesStore();
  const { refTypes, isRefTypesPending } = useRefTypes();
  const { refParamUpdateFormStructure } = useUpdateRefParamFormStructure({
    referenceTypesStore,
    refTypesOptions: mapToSelectOptions({
      data: isRefTypesPending ? [] : refTypes,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={refParamUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            refParamCallback?.();
          }}
          disabled={isPending}
        >
          <Save />
          Save
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            cancelCallback?.();
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
