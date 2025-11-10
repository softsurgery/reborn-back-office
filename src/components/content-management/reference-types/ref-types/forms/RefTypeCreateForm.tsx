import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { useCreateRefTypeFormStructure } from "./useCreateRefTypeFormStructure";
import { useRefTypes } from "@/hooks/content/reference-types/useRefTypes";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";

interface RefTypeCreateFormProps {
  className?: string;
  refTypeCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RefTypeCreateForm = ({
  className,
  refTypeCallback,
  cancelCallback,
  isPending,
}: RefTypeCreateFormProps) => {
  const referenceTypesStore = useReferenceTypesStore();
  const { refTypes, isRefTypesPending } = useRefTypes();

  const { refTypeCreateFormStructure } = useCreateRefTypeFormStructure({
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
        structure={refTypeCreateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            refTypeCallback?.();
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
