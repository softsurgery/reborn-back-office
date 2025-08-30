import React from "react";
import { BaseProfile } from "./BaseProfile";
import { useIdentifiedUser } from "@/hooks/content/User/useIdentifiedUser";
import { useUserStore } from "@/hooks/stores/useUserStore";

interface UserProfileProps {
  className?: string;
  id: string;
}

export const UserProfile = ({ className, id }: UserProfileProps) => {
  const userStore = useUserStore();
  const { user, isFetchUserPending } = useIdentifiedUser(id, "role");
  React.useEffect(() => {
    if (user) {
      userStore.set("response", user);
      return () => {
        userStore.reset();
      };
    }
  }, [user]);

  return (
    <BaseProfile
      className={className}
      isFetchUserPending={isFetchUserPending}
    />
  );
};
