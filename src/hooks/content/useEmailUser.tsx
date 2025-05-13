import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useEmailUser = (
  email?: string,
  join?: string,
  enabled?: boolean
) => {
  const {
    isFetching: isFetchUserPending,
    data: userResp,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", email, join],
    queryFn: () => api.admin.user.findByEmail(email, join),
    enabled: enabled && !!email,
  });

  const user = React.useMemo(() => {
    if (!userResp) return null;
    return userResp;
  }, [userResp]);

  return {
    user,
    isFetchUserPending,
    refetchUser,
  };
};
