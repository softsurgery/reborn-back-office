import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

interface ResourceDeleteDialogProps {
  representation?: string;
  deleteResource?: () => void;
  isDeletionPending?: boolean;
}

export const useResourceDeleteDialog = ({
  representation,
  deleteResource,
  isDeletionPending,
}: ResourceDeleteDialogProps) => {
  const {
    DialogFragment: deleteResourceDialog,
    openDialog: openDeleteResourceDialog,
    closeDialog: closeDeleteResourceDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Resource <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent. Deleting the resource will remove it from the system.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteResource?.();
              closeDeleteResourceDialog();
            }}
          >
            Delete
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteResourceDialog();
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
    deleteResourceDialog,
    openDeleteResourceDialog,
    closeDeleteResourceDialog,
  };
};
