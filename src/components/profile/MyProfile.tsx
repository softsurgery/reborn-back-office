import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import React from "react";
import { identifyUser } from "@/lib/users-management/utils/identify-user.util";
import { useUserStore } from "@/hooks/stores/useUserStore";

interface MyProfileProps {
  className?: string;
}

export const MyProfile = ({ className }: MyProfileProps) => {
  const userStore = useUserStore();
  const { user, isFetchUserPending } = useCurrentUser("role");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    if (user) {
      userStore.set("response", user);
      setRoutes?.([{ title: "Profile" }]);
      setIntro?.(
        `${identifyUser(user)}'s Profile`,
        "View, update, and manage your profile."
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
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
