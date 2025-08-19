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
  const { t } = useTranslation("jobTag");

  const {
    SheetFragment: createJobTagSheet,
    openSheet: openCreateJobTagSheet,
    closeSheet: closeCreateJobTagSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <MapIcon />
        Create Tag
      </div>
    ),
    description:
      "Add a new job tag to help categorize and organize job postings.",
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
