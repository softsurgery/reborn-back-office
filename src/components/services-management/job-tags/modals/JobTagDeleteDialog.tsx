import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

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
  const {
    DialogFragment: deleteJobTagDialog,
    openDialog: openDeleteJobTagDialog,
    closeDialog: closeDeleteJobTagDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete JobTag <span className="font-light">{jobTagLabel}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent.Please proceed with caution.",
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
            Delete
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteJobTagDialog();
            }}
          >
            Cancel
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
