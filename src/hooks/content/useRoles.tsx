import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useRoles = (enabled: boolean) => {
  const { isFetching: isFetchRolesPending, data: rolesResp,refetch: refetchRoles } =
    useQuery({
      queryKey: ["roles"],
      queryFn: () => api.admin.role.findAll(),
      enabled
    });

  const roles = React.useMemo(() => {
    if (!rolesResp) return [];
    return rolesResp;
  }, [rolesResp]);

  return {
    roles,
    isFetchRolesPending,
    refetchRoles
  };
};