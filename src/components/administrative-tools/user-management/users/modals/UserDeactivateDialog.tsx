import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UserDeactivateDialogProps {
  userFullname?: string;
  deactivateUser?: () => void;
  isDeactivationPending?: boolean;
  resetUser?: () => void;
}

export const useDeactivateUserDialog = ({
  userFullname,
  deactivateUser,
  isDeactivationPending,
  resetUser,
}: UserDeactivateDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deactivateUserDialog,
    openDialog: openDeactivateUserDialog,
    closeDialog: closeDeactivateUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.deactivateUserTitle")} <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description:
      t("userManagement.dialogs.deactivateUserDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deactivateUser?.();
              closeDeactivateUserDialog();
            }}
          >
            {tCommon("common.buttons.deactivate")}
            <Spinner show={isDeactivationPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeactivateUserDialog();
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
    deactivateUserDialog,
    openDeactivateUserDialog,
    closeDeactivateUserDialog,
  };
};
