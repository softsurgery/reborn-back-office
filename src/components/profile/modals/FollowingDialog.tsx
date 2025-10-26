import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";
import { useTranslation } from "react-i18next";  

interface FollowingDialogProps {
  userStore: UserStore;
}

export const useFollowingDialog = ({ userStore }: FollowingDialogProps) => {
  const { t } = useTranslation('user-management');
  const {
    DialogFragment: followingDialog,
    openDialog: openFollowingDialog,
    closeDialog: closeFollowingDialog,
  } = useDialog({
    title: <div className="leading-normal">{t("userManagement.inspect.followingDialog.title")}</div>,
    description: t("userManagement.inspect.followingDialog.description"),
    children: (
      <div className="flex flex-1 flex-col">
        {userStore.followings.length > 0 ? (
          userStore.followings.map((f) => (
            <UserEntry
              key={f.id}
              user={f.following}
              closeDialog={() => closeFollowingDialog()}
            />
          ))
        ) : (
          <div className="flex text-sm items-center justify-center py-6 text-muted-foreground">
            {t("userManagement.inspect.followingDialog.noFollowings")}
          </div>
        )}
      </div>
    ),
  });
  return {
    followingDialog,
    openFollowingDialog,
    closeFollowingDialog,
  };
};
