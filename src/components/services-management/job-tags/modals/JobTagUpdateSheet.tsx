import { MapIcon } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { JobTagUpdateForm } from "../forms/JobTagUpdateForm";
import { useTranslation } from "next-i18next";

interface JobTagUpdateSheet {
  updateJobTag?: () => void;
  isUpdatePending?: boolean;
  resetJobTag?: () => void;
}

export const useJobTagUpdateSheet = ({
  updateJobTag,
  isUpdatePending,
  resetJobTag,
}: JobTagUpdateSheet) => {
  const { t } = useTranslation("job");
  const {
    openSheet: openUpdateJobTagSheet,
    SheetFragment: updateJobTagSheet,
    closeSheet: closeUpdateJobTagSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <MapIcon />
        {t("jobTags.sheet.updateTitle")}
      </div>
    ),
    description: t("jobTags.sheet.updateDescription"),
    children: (
      <JobTagUpdateForm
        jobTagCallback={updateJobTag}
        cancelCallback={() => {
          closeUpdateJobTagSheet?.();
          resetJobTag?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[25vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJobTag,
  });

  return {
    updateJobTagSheet,
    openUpdateJobTagSheet,
    closeUpdateJobTagSheet,
  };
};
