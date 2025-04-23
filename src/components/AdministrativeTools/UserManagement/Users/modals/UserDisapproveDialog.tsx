import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface UserDisapproveDialogProps {
  representation?: string;
  disapproveUser?: () => void;
  isDisapprovalPending?: boolean;
  resetUser?: () => void;
}

export const useDisapproveUserDialog = ({
  representation,
  disapproveUser,
  isDisapprovalPending,
  resetUser,
}: UserDisapproveDialogProps) => {
  const {
    DialogFragment: disapproveUserDialog,
    openDialog: openDisapproveUserDialog,
    closeDialog: closeDisapproveUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Disapprove User <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      "This action will disapprove the user and revoke their eligibility for promotion. Make sure this aligns with your moderation policies and user management guidelines.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              disapproveUser?.();
              closeDisapproveUserDialog();
            }}
          >
            Disapprove
            <Spinner show={isDisapprovalPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDisapproveUserDialog();
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
    disapproveUserDialog,
    openDisapproveUserDialog,
    closeDisapproveUserDialog,
  };
};
