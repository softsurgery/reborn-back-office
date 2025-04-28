import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface UploadDeleteDialogProps {
  representation?: string;
  deleteUpload?: () => void;
  isDeletionPending?: boolean;
}

export const useUploadDeleteDialog = ({
  representation,
  deleteUpload,
  isDeletionPending,
}: UploadDeleteDialogProps) => {
  const {
    DialogFragment: deleteUploadDialog,
    openDialog: openDeleteUploadDialog,
    closeDialog: closeDeleteUploadDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Upload <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent. Deleting the upload will remove it from the system.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteUpload?.();
              closeDeleteUploadDialog();
            }}
          >
            Delete
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteUploadDialog();
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
    deleteUploadDialog,
    openDeleteUploadDialog,
    closeDeleteUploadDialog,
  };
};
