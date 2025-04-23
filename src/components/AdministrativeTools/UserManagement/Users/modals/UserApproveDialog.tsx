import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface UserApproveDialogProps {
  representation?: string;
  approveUser?: () => void;
  isApprovalPending?: boolean;
  resetUser?: () => void;
}

export const useApproveUserDialog = ({
  representation,
  approveUser,
  isApprovalPending,
  resetUser,
}: UserApproveDialogProps) => {
  const {
    DialogFragment: approveUserDialog,
    openDialog: openApproveUserDialog,
    closeDialog: closeApproveUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Approve User <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      "This action will approve user and promote them to the moderator role. Ensure this action aligns with your intended changes",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              approveUser?.();
              closeApproveUserDialog();
            }}
          >
            Approve
            <Spinner show={isApprovalPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeApproveUserDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });

  return {
    approveUserDialog,
    openApproveUserDialog,
    closeApproveUserDialog,
  };
};
