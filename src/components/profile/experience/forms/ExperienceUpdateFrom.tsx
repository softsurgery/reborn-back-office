import React from "react";
import { cn } from "@/lib/utils";
import { useExperienceStore } from "@/hooks/stores/useExperienceStore";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useUpdateExperienceFormStructure } from "./useUpdateExperienceFormStructure";
import { Save } from "lucide-react";
import { updateExperienceSchema } from "@/types/validations/experience.validation";
import { Spinner } from "@/components/shared/Spinner";
import { UpdateExperienceDto } from "@/types";
import { useTranslation } from "react-i18next";

interface ExperienceUpdateFormProps {
  className?: string;
  updateExperience?: (experience: UpdateExperienceDto) => void;
  isUpdatePending?: boolean;
}

export const ExperienceUpdateForm: React.FC<ExperienceUpdateFormProps> = ({
  className,
  updateExperience,
  isUpdatePending,
}) => {
  const { t: tCommon } = useTranslation("common");
  const experienceStore = useExperienceStore();

  // These would come from your API or constants

  const { experienceUpdateFormStructure } = useUpdateExperienceFormStructure({
    experienceStore,
  });

  const validateForm = React.useCallback(() => {
    const experienceResult = updateExperienceSchema.safeParse(
      experienceStore.updateDto,
    );
    if (!experienceResult.success) {
      experienceStore.set(
        "updateDtoErrors",
        experienceResult.error.flatten().fieldErrors,
      );
      return false;
    }
    return true;
  }, [experienceStore]);

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;

    updateExperience?.(experienceStore.updateDto);
  };

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-4", className)}
    >
      {/* Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden">
        <FormBuilder structure={experienceUpdateFormStructure} />
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
        <Button onClick={handleSubmit} disabled={isUpdatePending}>
          <Save /> {tCommon("common.buttons.update")}
          <Spinner show={isUpdatePending} />
        </Button>
      </div>
    </div>
  );
};
