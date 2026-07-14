import React from "react";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";
import { Spinner } from "../shared/Spinner";
import { cn } from "@/lib/utils";

interface MyProfileProps {
  className?: string;
}

export const MyProfile = ({ className }: MyProfileProps) => {
  const { t } = useTranslation("user-management");
  const userStore = useUserStore();
  const { user, isFetchUserPending } = useCurrentUser("role");

  React.useEffect(() => {
    if (user && userStore.response !== user) userStore.set("response", user);
    return () => {
      userStore.reset();
    };
  }, [user]);
  return (
    <div
      className={cn(
        "flex flex-col flex-1 items-center justify-center",
        className,
      )}
    >
      {/* Message de chargement */}
      {isFetchUserPending ? (
        <Spinner />
      ) : (
        <BaseProfile
          className={className}
          isFetchUserPending={isFetchUserPending}
        />
      )}
    </div>
  );
};
