import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";

interface FollowingDialogProps {
  userStore: UserStore;
}

export const useFollowingDialog = ({ userStore }: FollowingDialogProps) => {
  const {
    DialogFragment: followingDialog,
    openDialog: openFollowingDialog,
    closeDialog: closeFollowingDialog,
  } = useDialog({
    title: <div className="leading-normal">Following</div>,
    description: "You are following these users:",
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
            No followings yet.
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
