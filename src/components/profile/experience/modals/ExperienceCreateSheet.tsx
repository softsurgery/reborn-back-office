import { Briefcase } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ExperienceCreateForm } from "../forms/ExperienceCreateFrom";
import { useTranslation } from "react-i18next";
import { CreateExperienceDto } from "@/types";

interface ExperienceCreateSheet {
  addExperience?: (experience: CreateExperienceDto) => void;
  isAddPending?: boolean;
  resetExperience?: () => void;
  userId: string;
}

export const useExperienceCreateSheet = ({
  addExperience,
  isAddPending,
  resetExperience,
}: ExperienceCreateSheet) => {
  const { t } = useTranslation("user-management");
  const {
    SheetFragment: experienceCreateSheet,
    openSheet: openExperienceCreateSheet,
    closeSheet: closeExperienceCreateSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Briefcase />
        {t("userManagement.experience.sheet.createTitle")}
      </div>
    ),
    description: t("userManagement.experience.sheet.createDescription"),
    children: (
      <ExperienceCreateForm
        addExperience={addExperience}
        isAddPending={isAddPending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetExperience?.();
    },
  });

  return {
    experienceCreateSheet,
    openExperienceCreateSheet,
    closeExperienceCreateSheet,
  };
};
