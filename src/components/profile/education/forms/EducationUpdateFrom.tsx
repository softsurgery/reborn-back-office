import React from "react";
import { cn } from "@/lib/utils";
import { useEducationStore } from "../../../../hooks/stores/useEducationStore";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useUpdateEducationFormStructure } from "./useUpdateEducationFormStructure";
import { Save } from "lucide-react";
import { updateEducationSchema } from "@/types/validations/education.validation";
import { Spinner } from "@/components/shared/Spinner";
import { UpdateEducationDto } from "@/types";
import { useTranslation } from "react-i18next";

interface EducationUpdateFormProps {
  className?: string;
  updateEducation?: (education: UpdateEducationDto) => void;
  isUpdatePending?: boolean;
  educationId?: string; // Note: Education ID is string, not number
}

export const EducationUpdateForm: React.FC<EducationUpdateFormProps> = ({
  className,
  updateEducation,
  isUpdatePending,
  educationId,
}) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("education");
  const educationStore = useEducationStore();

  const { educationUpdateFormStructure } = useUpdateEducationFormStructure({
    educationStore,
  });

  const validateForm = React.useCallback(() => {
    const educationResult = updateEducationSchema.safeParse(
      educationStore.updateDto,
    );
    if (!educationResult.success) {
      educationStore.set(
        "updateDtoErrors",
        educationResult.error.flatten().fieldErrors,
      );
      return false;
    }
    return true;
  }, [educationStore]);

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;

    updateEducation?.(educationStore.updateDto);
  };

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-4", className)}
    >
      {/* Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden">
        <FormBuilder structure={educationUpdateFormStructure} />
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
