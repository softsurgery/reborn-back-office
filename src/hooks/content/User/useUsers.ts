import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface UseUsersProps {
  filter?: string;
  join?: string;
  search?: string;
  enabled?: boolean;
}

export const useUsers = ({ filter, join, search, enabled }: UseUsersProps) => {
  const {
    data: usersResp,
    isFetching: isFetchUsersPending,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", filter, join, search],
    queryFn: () => api.admin.user.findAll({ filter, join, search }),
    enabled: enabled,
  });

  const users = React.useMemo(() => {
    if (!usersResp) return null;
    return usersResp;
  }, [usersResp]);

  return {
    users,
    isFetchUsersPending,
    refetchUsers,
  };
};
