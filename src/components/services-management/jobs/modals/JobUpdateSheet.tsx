import { Briefcase } from "lucide-react";
import { JobUpdateForm } from "../forms/JobUpdateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface JobUpdateSheetProps {
  updateJob?: () => void;
  isUpdatePending?: boolean;
  resetJob?: () => void;
}

export const useJobUpdateSheet = ({
  updateJob,
  isUpdatePending,
  resetJob,
}: JobUpdateSheetProps) => {
  const { t } = useTranslation("job");
  const {
    SheetFragment: updateJobSheet,
    openSheet: openUpdateJobSheet,
    closeSheet: closeUpdateJobSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Briefcase />
        {t("job.sheet.updateTitle")}
      </div>
    ),
    description: `${t("job.sheet.updateDescription")}`,
    children: (
      <JobUpdateForm
        className="my-4"
        jobCallback={updateJob}
        cancelCallback={() => {
          closeUpdateJobSheet?.();
          resetJob?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJob,
  });

  return {
    updateJobSheet,
    openUpdateJobSheet,
    closeUpdateJobSheet,
  };
};
