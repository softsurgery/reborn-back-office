import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface UserDeleteDialogProps {
  userFullname?: string;
  deleteUser?: () => void;
  isDeletePending?: boolean;
}

export const useUserDeleteDialog = ({
  userFullname,
  deleteUser,
  isDeletePending,
}: UserDeleteDialogProps) => {
  const {
    DialogFragment: deleteUserDialog,
    openDialog: openDeleteUserDialog,
    closeDialog: closeDeleteUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete User <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent. Deleting the user will remove all associated roles and connections, affecting their access and permissions. Please proceed with caution.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteUser?.();
              closeDeleteUserDialog();
            }}
          >
            Delete
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteUserDialog();
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
    deleteUserDialog,
    openDeleteUserDialog,
    closeDeleteUserDialog,
  };
};
