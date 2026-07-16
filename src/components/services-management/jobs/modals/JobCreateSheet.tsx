import { Briefcase } from "lucide-react";
import { CreateJob } from "../forms/CreateJob";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface JobCreateSheetProps {
  createJob?: () => void;
  isCreatePending?: boolean;
  resetJob?: () => void;
}

export const useJobCreateSheet = ({
  createJob,
  isCreatePending,
  resetJob,
}: JobCreateSheetProps) => {
  const { t } = useTranslation("job");
  const {
    SheetFragment: createJobSheet,
    openSheet: openCreateJobSheet,
    closeSheet: closeCreateJobSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Briefcase />
        {t("job.sheet.createTitle")}
      </div>
    ),
    description: t("job.sheet.createDescription"),
    children: (
      <CreateJob
        className="my-4"
        jobCallback={createJob}
        cancelCallback={() => {
          closeCreateJobSheet?.();
          resetJob?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetJob,
  });

  return {
    createJobSheet,
    openCreateJobSheet,
    closeCreateJobSheet,
  };
};
