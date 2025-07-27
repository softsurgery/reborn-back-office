import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteUserDialog,
    openDialog: openDeleteUserDialog,
    closeDialog: closeDeleteUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.deleteUserTitle")} <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description: (
      <div>
        {t("userManagement.dialogs.deleteUserDescription")}
      </div>
    ),
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
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteUserDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
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
