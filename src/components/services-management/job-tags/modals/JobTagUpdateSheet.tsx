import { MapIcon } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { JobTagUpdateForm } from "../forms/JobTagUpdateForm";

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
  const {
    SheetFragment: updateJobTagSheet,
    openSheet: openUpdateJobTagSheet,
    closeSheet: closeUpdateJobTagSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <MapIcon />
        Update JobTag
      </div>
    ),
    description:
      "Use this form to update an existing job tag within the system. A job tag is identified by their unique id, Fill in all required fields to ensure the job tag is successfully updated.",
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
