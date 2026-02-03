import { GraduationCap } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { EducationCreateForm } from "../forms/EducationCreateFrom";
import { useTranslation } from "react-i18next";
import { CreateEducationDto } from "@/types";

interface EducationCreateSheet {
  addEducation?: (education: CreateEducationDto) => void;
  isAddPending?: boolean;
  resetEducation?: () => void;
  userId: string;
}

export const useEducationCreateSheet = ({
  addEducation,
  isAddPending,
  resetEducation,
}: EducationCreateSheet) => {
  const { t } = useTranslation("user-management");
  const {
    SheetFragment: educationCreateSheet,
    openSheet: openEducationCreateSheet,
    closeSheet: closeEducationCreateSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <GraduationCap />
        {t("userManagement.inspect.books.education.sheet.createTitle")}
      </div>
    ),
    description: t(
      "userManagement.inspect.books.education.sheet.createDescription",
    ),
    children: (
      <EducationCreateForm
        className="mx-2"
        addEducation={addEducation}
        isAddPending={isAddPending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetEducation?.();
    },
  });

  return {
    educationCreateSheet,
    openEducationCreateSheet,
    closeEducationCreateSheet,
  };
};
