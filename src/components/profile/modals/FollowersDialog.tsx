import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";
import { useTranslation } from "react-i18next";
import React from "react";

interface FollowerDialogProps {
  userStore: UserStore;
}

export const useFollowerDialog = ({ userStore }: FollowerDialogProps) => {
  const { t } = useTranslation("user-management");
  const followersCount = userStore.followers.length;

 
  const {
    DialogFragment: followerDialog,
    openDialog,
    closeDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.inspect.followersDialog.title")}{" "}
        <span className="text-sm text-muted-foreground">({followersCount})</span>
      </div>
    ),
    description: t("userManagement.inspect.followersDialog.description"),
    children: (
      <div className="flex flex-col overflow-y-auto" style={{ maxHeight: "40vh" }}>
        {userStore.followers.map((f) => (
          <UserEntry key={f.id} user={f.follower} closeDialog={closeDialog} />
        ))}
      </div>
    ),
  });

  
  const openFollowerDialogSafe = () => {
    if (followersCount > 0) {
      openDialog();
    }
  };

  return {
    followerDialog,
    openFollowerDialog: openFollowerDialogSafe,
    closeFollowerDialog: closeDialog,
  };
};
