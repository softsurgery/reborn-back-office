import { useCurrentUser } from "@/hooks/content/User/useCurrentUser";
import { BaseProfile } from "./BaseProfile";
import { useIdentifiedUser } from "@/hooks/content/User/useIdentifiedUser";

interface UserProfileProps {
  className?: string;
  id: string;
}

export const UserProfile = ({ className, id }: UserProfileProps) => {
  const { user, isFetchUserPending } = useIdentifiedUser(id, "role");
  return (
    <BaseProfile
      className={className}
      user={user}
      isFetchUserPending={isFetchUserPending}
    />
  );
};
