import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: disapproveUserDialog,
    openDialog: openDisapproveUserDialog,
    closeDialog: closeDisapproveUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.disapproveUserTitle")} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      t("userManagement.dialogs.disapproveUserDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              disapproveUser?.();
              closeDisapproveUserDialog();
            }}
          >
            {tCommon("common.buttons.disapprove")}
            <Spinner show={isDisapprovalPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDisapproveUserDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
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