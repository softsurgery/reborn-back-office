import { useSession } from "next-auth/react";
import { useEmailUser } from "./useEmailUser";

export const useCurrentUser = (join?: string) => {
  const { data: session } = useSession();
  const { user, isFetchUserPending, refetchUser } = useEmailUser(
    session?.user.email,
    join
  );
  return {
    user,
    isFetchUserPending,
    refetchUser,
  };
};
