import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface JobTagDeleteDialogProps {
  jobTagLabel?: string;
  deleteJobTag?: () => void;
  isDeletePending?: boolean;
}

export const useJobTagDeleteDialog = ({
  jobTagLabel,
  deleteJobTag,
  isDeletePending,
}: JobTagDeleteDialogProps) => {
  const { t: tJob } = useTranslation("job");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteJobTagDialog,
    openDialog: openDeleteJobTagDialog,
    closeDialog: closeDeleteJobTagDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tJob("jobTags.dialog.deleteTitle")}{" "}
        <span className="font-light">{jobTagLabel}</span> ?
      </div>
    ),
    description: tJob("jobTags.dialog.deleteDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteJobTag?.();
              closeDeleteJobTagDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteJobTagDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    deleteJobTagDialog,
    openDeleteJobTagDialog,
    closeDeleteJobTagDialog,
  };
};
