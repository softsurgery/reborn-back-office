import { MapIcon } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { JobCategoryUpdateForm } from "../forms/JobCategoryUpdateForm";
import { useTranslation } from "next-i18next";

interface JobCategoryUpdateSheet {
  updateJobCategory?: () => void;
  isUpdatePending?: boolean;
  resetJobCategory?: () => void;
}

export const useJobCategoryUpdateSheet = ({
  updateJobCategory,
  isUpdatePending,
  resetJobCategory,
}: JobCategoryUpdateSheet) => {
  const { t } = useTranslation("job");
  const {
    openSheet: openUpdateJobCategorySheet,
    SheetFragment: updateJobCategorySheet,
    closeSheet: closeUpdateJobCategorySheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <MapIcon />
        {t("jobCategory.sheet.updateTitle")}
      </div>
    ),
    description: t("jobCategory.sheet.updateDescription"),
    children: (
      <JobCategoryUpdateForm
        jobCategoryCallback={updateJobCategory}
        cancelCallback={() => {
          closeUpdateJobCategorySheet?.();
          resetJobCategory?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[25vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJobCategory,
  });

  return {
    updateJobCategorySheet,
    openUpdateJobCategorySheet,
    closeUpdateJobCategorySheet,
  };
};
