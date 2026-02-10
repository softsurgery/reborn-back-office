import { Briefcase } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ExperienceUpdateForm } from "../forms/ExperienceUpdateFrom";
import { useTranslation } from "react-i18next";

interface ExperienceUpdateSheet {
  updateExperience?: () => void;
  isUpdatePending?: boolean;
  resetExperience?: () => void;
}

export const useExperienceUpdateSheet = ({
  updateExperience,
  isUpdatePending,
  resetExperience,
}: ExperienceUpdateSheet) => {
  const { t } = useTranslation("user-management");
  const {
    SheetFragment: experienceUpdateSheet,
    openSheet: openExperienceUpdateSheet,
    closeSheet: closeExperienceUpdateSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Briefcase />
        {t("userManagement.experience.sheet.updateTitle")}
      </div>
    ),
    description: t("userManagement.experience.sheet.updateDescription"),
    children: (
      <ExperienceUpdateForm
        className="mx-2"
        updateExperience={updateExperience}
        isUpdatePending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetExperience?.();
    },
  });

  return {
    experienceUpdateSheet,
    openExperienceUpdateSheet,
    closeExperienceUpdateSheet,
  };
};
