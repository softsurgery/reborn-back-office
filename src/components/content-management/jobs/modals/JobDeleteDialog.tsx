import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

interface JobDeleteDialogProps {
  jobLabel?: string;
  deleteJob?: () => void;
  isDeletePending?: boolean;
}

export const useJobDeleteDialog = ({
  jobLabel,
  deleteJob,
  isDeletePending,
}: JobDeleteDialogProps) => {
  const {
    DialogFragment: deleteJobDialog,
    openDialog: openDeleteJobDialog,
    closeDialog: closeDeleteJobDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Job <span className="font-light">{jobLabel}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent. Please proceed with caution.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteJob?.();
              closeDeleteJobDialog();
            }}
          >
            Delete
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteJobDialog();
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
    deleteJobDialog,
    openDeleteJobDialog,
    closeDeleteJobDialog,
  };
};
