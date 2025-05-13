import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import React from "react";
import { identifyUser } from "@/lib/users-management/utils/identify-user.util";

interface MyProfileProps {
  className?: string;
}

export const MyProfile = ({ className }: MyProfileProps) => {
  const { user, isFetchUserPending } = useCurrentUser("role");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    if (user) {
      setRoutes?.([{ title: "Profile" }]);
      setIntro?.(
        `${identifyUser(user)}'s Profile`,
        "View, update, and manage your profile."
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [user]);
  return (
    <BaseProfile
      className={className}
      user={user}
      isFetchUserPending={isFetchUserPending}
    />
  );
};
