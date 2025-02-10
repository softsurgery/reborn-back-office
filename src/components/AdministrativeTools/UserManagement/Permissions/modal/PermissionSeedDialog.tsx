import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface PermissionSeedDialogProps {
  seedPermission?: () => void;
  isSeedingPending?: boolean;
}

export const usePermissionSeedDialog = ({
  seedPermission,
  isSeedingPending,
}: PermissionSeedDialogProps) => {
  const {
    DialogFragment: seedPermissionDialog,
    openDialog: openSeedPermissionDialog,
    closeDialog: closeSeedPermissionDialog,
  } = useDialog({
    title: <div className="leading-normal">Permissions Seeding</div>,
    description:
      "This action will seed the system permissions, including all its associations. You can't undo this action later.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              seedPermission?.();
              closeSeedPermissionDialog();
            }}
          >
            Confirm
            <Spinner show={isSeedingPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeSeedPermissionDialog();
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
    seedPermissionDialog,
    openSeedPermissionDialog,
    closeSeedPermissionDialog,
  };
};
