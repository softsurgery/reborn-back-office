import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

interface BugDeleteDialogProps {
  bugMessage?: string;
  deleteBug?: () => void;
  isDeletionPending?: boolean;
  resetBug?: () => void;
}

export const useBugDeleteDialog = ({
  bugMessage,
  deleteBug,
  isDeletionPending,
  resetBug,
}: BugDeleteDialogProps) => {
  const {
    DialogFragment: deleteBugDialog,
    openDialog: openDeleteBugDialog,
    closeDialog: closeDeleteBugDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Are you sure you want to delete ?
      </div>
    ),
    description: "This action is permanent and cannot be undone.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteBug?.();
              closeDeleteBugDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetBug?.();
              closeDeleteBugDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetBug,
  });

  return {
    deleteBugDialog,
    openDeleteBugDialog,
    closeDeleteBugDialog,
  };
};
