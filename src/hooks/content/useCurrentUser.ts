import { useSession } from "next-auth/react";
import { useEmailUser } from "./useEmailUser";

export const useCurrentUser = () => {
  const { data: session } = useSession();
  const { user, isFetchUserPending, refetchUser } = useEmailUser(
    session?.user.email,
    true
  );
  return {
    user,
    isFetchUserPending,
    refetchUser,
  };
};
