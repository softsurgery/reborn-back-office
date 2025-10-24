import React from "react";
import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next"; 

interface MyProfileProps {
  className?: string;
}

export const MyProfile = ({ className }: MyProfileProps) => {
  const { t } = useTranslation('myProfile'); 
  const userStore = useUserStore();
  const { user, isFetchUserPending } = useCurrentUser("role");
  React.useEffect(() => {
    if (user) {
      userStore.set("response", user);
      return () => {
        userStore.reset();
      };
    }
  }, [user]);
  return (
   <div className={className}>
      {/* Titre dynamique */}
      <h1>{t("profile")}</h1> 

      {/* Message de chargement */}
      {isFetchUserPending ? (
        <p>{t("loadingProfile")}</p> 
      ) : (
        <BaseProfile
          className={className}
          isFetchUserPending={isFetchUserPending}
        />
      )}
    </div>
  );
};
