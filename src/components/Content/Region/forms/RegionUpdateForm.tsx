import React from "react";
import { cn } from "@/lib/utils";
import { useRegionStore } from "@/hooks/stores/useRegionStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useUpdateRegionFormStructure } from "./useUpdateRegionFormStructure";
import { useTranslation } from "react-i18next";

interface RegionFormProps {
  className?: string;
  regionCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RegionUpdateForm: React.FC<RegionFormProps> = ({
  className,
  regionCallback,
  cancelCallback,
  isPending,
}) => {
  const regionStore = useRegionStore();
  const { t: tCommon } = useTranslation("common");
  const { regionUpdateFormStructure } = useUpdateRegionFormStructure({
    regionStore,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={regionUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            regionCallback?.();
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
