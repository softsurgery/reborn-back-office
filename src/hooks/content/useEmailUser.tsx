import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useEmailUser = (email?: string, enabled?: boolean) => {
  const {
    isFetching: isFetchUserPending,
    data: userResp,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.admin.user.findByEmail(email),
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
