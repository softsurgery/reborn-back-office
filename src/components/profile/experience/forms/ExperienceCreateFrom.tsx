import React from "react";
import { cn } from "@/lib/utils";
import { useExperienceStore } from "@/hooks/stores/useExperienceStore";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useCreateExperienceFormStructure } from "./useCreateExperienceFormStructure";
import { Save } from "lucide-react";
import { createExperienceSchema } from "@/types/validations/experience.validation";
import { Spinner } from "@/components/shared/Spinner";
import { CreateExperienceDto } from "@/types";
import { useTranslation } from "react-i18next";

interface ExperienceCreateFormProps {
  className?: string;
  addExperience?: (experience: CreateExperienceDto) => void;
  isAddPending?: boolean;
  userId?: string;
}

export const ExperienceCreateForm: React.FC<ExperienceCreateFormProps> = ({
  className,
  addExperience,
  isAddPending,
  userId,
}) => {
  const { t: tCommon } = useTranslation("common");
  const experienceStore = useExperienceStore();

  const { experienceCreateFormStructure } = useCreateExperienceFormStructure({
    experienceStore,
  });

  const validateForm = React.useCallback(() => {
    const experienceResult = createExperienceSchema.safeParse({
      ...experienceStore.createDto,
      userId,
    });
    if (!experienceResult.success) {
      experienceStore.set(
        "createDtoErrors",
        experienceResult.error.flatten().fieldErrors,
      );
      return false;
    }
    return true;
  }, [experienceStore, userId]);

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;

    addExperience?.({
      ...experienceStore.createDto,
    });
  };

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-4", className)}
    >
      {/* Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden">
        <FormBuilder structure={experienceCreateFormStructure} />
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
        <Button onClick={handleSubmit} disabled={isAddPending}>
          <Save /> {tCommon("common.buttons.save")}
          <Spinner show={isAddPending} />
        </Button>
      </div>
    </div>
  );
};
