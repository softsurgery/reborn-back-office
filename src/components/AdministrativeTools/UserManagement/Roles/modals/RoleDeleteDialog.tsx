import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface RoleDeleteDialogProps {
  roleLabel?: string;
  deleteRole?: () => void;
  isDeletionPending?: boolean;
  resetRole?: () => void;
}

export const useRoleDeleteDialog = ({
  roleLabel,
  deleteRole,
  isDeletionPending,
  resetRole
}: RoleDeleteDialogProps) => {
  const {
    DialogFragment: deleteRoleDialog,
    openDialog: openDeleteRoleDialog,
    closeDialog: closeDeleteRoleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Role <span className="font-light">{roleLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this role will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteRole?.();
              closeDeleteRoleDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetRole?.();
              closeDeleteRoleDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetRole,
  });

  return {
    deleteRoleDialog,
    openDeleteRoleDialog,
    closeDeleteRoleDialog,
  };
};
