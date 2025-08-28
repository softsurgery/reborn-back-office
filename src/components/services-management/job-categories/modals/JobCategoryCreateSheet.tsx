import { MapIcon } from "lucide-react";
import { JobCategoryCreateForm } from "../forms/JobCategoryCreateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface JobCategoryCreateSheetProps {
  createJobCategory?: () => void;
  isCreatePending?: boolean;
  resetJobCategory?: () => void;
}

export const useJobCategoryCreateSheet = ({
  createJobCategory,
  isCreatePending,
  resetJobCategory,
}: JobCategoryCreateSheetProps) => {
  const { t } = useTranslation("job");

  const {
    SheetFragment: createJobCategorySheet,
    openSheet: openCreateJobCategorySheet,
    closeSheet: closeCreateJobCategorySheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <MapIcon />
        {t("jobCategory.sheet.createTitle")}
      </div>
    ),
    description: t("jobCategory.sheet.createDescription"),
    children: (
      <JobCategoryCreateForm
        jobCategoryCallback={createJobCategory}
        cancelCallback={() => {
          closeCreateJobCategorySheet?.();
          resetJobCategory?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[25vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJobCategory,
  });

  return {
    createJobCategorySheet,
    openCreateJobCategorySheet,
    closeCreateJobCategorySheet,
  };
};
