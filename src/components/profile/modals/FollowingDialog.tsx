import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";
import { useTranslation } from "react-i18next";

interface FollowingDialogProps {
  userStore: UserStore;
}

export const useFollowingDialog = ({ userStore }: FollowingDialogProps) => {
  const { t } = useTranslation("user-management");
  const followingsCount = userStore.followings.length;

  const {
    DialogFragment: followingDialog,
    openDialog,
    closeDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.inspect.followingDialog.title")}{" "}
        <span className="text-sm text-muted-foreground">
          ({followingsCount})
        </span>
      </div>
    ),
    description: t("userManagement.inspect.followingDialog.description"),
    children: (
      <div
        className="flex flex-col overflow-y-auto"
        style={{
          maxHeight: "40vh",
        }}
      >
        {userStore.followings.map((f) => (
          <UserEntry key={f.id} user={f.following} />
        ))}
      </div>
    ),
  });

  const openFollowingDialogSafe = () => {
    if (followingsCount > 0) {
      openDialog();
    }
  };

  return {
    followingDialog,
    openFollowingDialog: openFollowingDialogSafe,
    closeFollowingDialog: closeDialog,
  };
};
