import { useDialog } from "@/components/shared/Dialogs";
import { UserStore } from "@/hooks/stores/useUserStore";
import { UserEntry } from "../UserEntry";

interface FollowerDialogProps {
  userStore: UserStore;
}

export const useFollowerDialog = ({ userStore }: FollowerDialogProps) => {
  const {
    DialogFragment: followerDialog,
    openDialog: openFollowerDialog,
    closeDialog: closeFollowerDialog,
  } = useDialog({
    title: <div className="leading-normal">Followers</div>,
    description: "These users are following you:",
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
            No followers yet.
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
