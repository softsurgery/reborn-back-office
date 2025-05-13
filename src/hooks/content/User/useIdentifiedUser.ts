import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useIdentifiedUser = (
  id?: string,
  join?: string,
  enabled?: boolean
) => {
  const {
    isFetching: isFetchUserPending,
    data: userResp,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", id, join],
    queryFn: () => api.admin.user.findById(id, join),
    enabled: enabled && !!id,
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
