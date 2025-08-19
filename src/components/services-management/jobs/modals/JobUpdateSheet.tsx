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
      <div className="flex items-center">
        <Briefcase />
        Update Job
      </div>
    ),
    description: "Modify the job details below.",
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
    className: "min-w-[33vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJob,
  });

  return {
    updateJobSheet,
    openUpdateJobSheet,
    closeUpdateJobSheet,
  };
};
