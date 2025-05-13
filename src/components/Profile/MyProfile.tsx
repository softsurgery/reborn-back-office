import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";

interface MyProfileProps {
  className?: string;
}

export const MyProfile = ({ className }: MyProfileProps) => {
  const { user, isFetchUserPending } = useCurrentUser("role");

  return (
    <BaseProfile
      className={className}
      user={user}
      isFetchUserPending={isFetchUserPending}
    />
  );
};
