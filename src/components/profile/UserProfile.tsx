import { BaseProfile } from "./BaseProfile";
import { useIdentifiedUser } from "@/hooks/content/User/useIdentifiedUser";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import React from "react";
import { identifyUser } from "@/lib/users-management/utils/identify-user.util";
import { useUserStore } from "@/hooks/stores/useUserStore";

interface UserProfileProps {
  className?: string;
  id: string;
}

export const UserProfile = ({ className, id }: UserProfileProps) => {
  const userStore = useUserStore();
  const { user, isFetchUserPending } = useIdentifiedUser(id, "role");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    const identification = identifyUser(user);
    if (user) {
      userStore.set("response", user);
      setRoutes?.([{ title: "Profile" }]);
      setIntro?.(
        `${identification}'s Profile`,
        `This is ${identification}'s profile, you can inspect and update it.`
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
