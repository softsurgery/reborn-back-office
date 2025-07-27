import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UserActivateDialogProps {
  userFullname?: string;
  activateUser?: () => void;
  isActivationPending?: boolean;
  resetUser?: () => void;
}

export const useActivateUserDialog = ({
  userFullname,
  activateUser,
  isActivationPending,
  resetUser,
}: UserActivateDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: activateUserDialog,
    openDialog: openActivateUserDialog,
    closeDialog: closeActivateUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.activateUserTitle")} <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description:
      t("userManagement.dialogs.activateUserDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              activateUser?.();
              closeActivateUserDialog();
            }}
          >
            {tCommon("common.buttons.activate")}
            <Spinner show={isActivationPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeActivateUserDialog();
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
    activateUserDialog,
    openActivateUserDialog,
    closeActivateUserDialog,
  };
};
