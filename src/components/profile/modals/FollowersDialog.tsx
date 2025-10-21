import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";
import { useTranslation } from "react-i18next";

interface FollowerDialogProps {
  userStore: UserStore;
}

export const useFollowerDialog = ({ userStore }: FollowerDialogProps) => {
  const { t } = useTranslation('followersDialog');
  const {
    DialogFragment: followerDialog,
    openDialog: openFollowerDialog,
    closeDialog: closeFollowerDialog,
  } = useDialog({
    title: <div className="leading-normal">{t("title")}</div>,
    description: t("description"),
    children: (
      <div className="flex flex-1 flex-col">
        {userStore.followers.length > 0 ? (
          userStore.followers.map((f) => (
            <UserEntry
              key={f.id}
              user={f.follower}
              closeDialog={() => closeFollowerDialog()}
            />
          ))
        ) : (
          <div className="flex text-sm items-center justify-center py-6 text-muted-foreground">
            {t("noFollowers")}
          </div>
        )}
      </div>
    ),
  });

  return {
    followerDialog,
    openFollowerDialog,
    closeFollowerDialog,
  };
};
