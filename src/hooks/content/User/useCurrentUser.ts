import { useSession } from "next-auth/react";
import { useEmailUser } from "./useEmailUser";

export const useCurrentUser = (join?: string) => {
  const { data: session } = useSession();
  const { user, isFetchUserPending, refetchUser } = useEmailUser(
    session?.user?.email || undefined,
    join
  );
  return {
    user,
    isFetchUserPending,
    refetchUser,
  };
};
