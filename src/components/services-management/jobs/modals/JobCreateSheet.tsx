import { Briefcase } from "lucide-react";
import { JobCreateForm } from "../forms/JobCreateForm";
import { useSheet } from "@/components/shared/Sheets";

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
  const {
    SheetFragment: createJobSheet,
    openSheet: openCreateJobSheet,
    closeSheet: closeCreateJobSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <Briefcase />
        Create Job
      </div>
    ),
    description: "Fill out the job details below.",
    children: (
      <JobCreateForm
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
