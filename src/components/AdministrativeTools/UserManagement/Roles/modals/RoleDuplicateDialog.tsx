import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface RoleDuplicateDialogProps {
  roleLabel?: string;
  duplicateRole?: () => void;
  isDuplicationPending?: boolean;
  resetRole?: () => void;
}

export const useRoleDuplicateDialog = ({
  roleLabel,
  duplicateRole,
  isDuplicationPending,
  resetRole,
}: RoleDuplicateDialogProps) => {
  const {
    DialogFragment: duplicateRoleDialog,
    openDialog: openDuplicateRoleDialog,
    closeDialog: closeDuplicateRoleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Duplicate Role <span className="font-light">{roleLabel}</span> ?
      </div>
    ),
    description:
      "This action will duplicate the role, including all its associations. You can undo this action later if needed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              duplicateRole?.();
              closeDuplicateRoleDialog();
            }}
          >
            Confirm
            <Spinner show={isDuplicationPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDuplicateRoleDialog();
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
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  };
};
