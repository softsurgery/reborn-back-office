import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useRoles = () => {
  const { isFetching: isFetchRolesPending, data: rolesResp } =
    useQuery({
      queryKey: ["roles"],
      queryFn: () => api.role.findAll(),
    });

  const roles = React.useMemo(() => {
    if (!rolesResp) return [];
    return rolesResp;
  }, [rolesResp]);

  return {
    roles,
    isFetchRolesPending,
  };
};