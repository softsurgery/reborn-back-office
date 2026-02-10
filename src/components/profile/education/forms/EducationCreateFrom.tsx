import React from "react";
import { cn } from "@/lib/utils";
import { useEducationStore } from "../../../../hooks/stores/useEducationStore";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useCreateEducationFormStructure } from "./useCreateEducationFormStructure";
import { Save } from "lucide-react";
import { createEducationSchema } from "@/types/validations/education.validation";
import { Spinner } from "@/components/shared/Spinner";
import { CreateEducationDto } from "@/types";
import { useTranslation } from "react-i18next";

interface EducationCreateFormProps {
  className?: string;
  addEducation?: (education: CreateEducationDto) => void;
  isAddPending?: boolean;
  userId?: string;
}

export const EducationCreateForm: React.FC<EducationCreateFormProps> = ({
  className,
  addEducation,
  isAddPending,
  userId,
}) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("education");
  const educationStore = useEducationStore();

  const { educationCreateFormStructure } = useCreateEducationFormStructure({
    educationStore,
  });

  const validateForm = React.useCallback(() => {
    const educationResult = createEducationSchema.safeParse({
      ...educationStore.createDto,
      userId,
    });
    if (!educationResult.success) {
      educationStore.set(
        "createDtoErrors",
        educationResult.error.flatten().fieldErrors,
      );
      return false;
    }
    return true;
  }, [educationStore, userId]);

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;

    addEducation?.({
      ...educationStore.createDto,
    });
  };

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-4", className)}
    >
      {/* Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden">
        <FormBuilder structure={educationCreateFormStructure} />
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
