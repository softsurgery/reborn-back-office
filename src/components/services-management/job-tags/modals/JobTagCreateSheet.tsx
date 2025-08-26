import { MapIcon } from "lucide-react";
import { JobTagCreateForm } from "../forms/JobTagCreateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface JobTagCreateSheetProps {
  createJobTag?: () => void;
  isCreatePending?: boolean;
  resetJobTag?: () => void;
}

export const useJobTagCreateSheet = ({
  createJobTag,
  isCreatePending,
  resetJobTag,
}: JobTagCreateSheetProps) => {
  const { t } = useTranslation("job");

  const {
    SheetFragment: createJobTagSheet,
    openSheet: openCreateJobTagSheet,
    closeSheet: closeCreateJobTagSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <MapIcon />
        {t("jobTags.sheet.createTitle")}
      </div>
    ),
    description: t("jobTags.sheet.createDescription"),
    children: (
      <JobTagCreateForm
        jobTagCallback={createJobTag}
        cancelCallback={() => {
          closeCreateJobTagSheet?.();
          resetJobTag?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[25vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJobTag,
  });

  return {
    createJobTagSheet,
    openCreateJobTagSheet,
    closeCreateJobTagSheet,
  };
};
