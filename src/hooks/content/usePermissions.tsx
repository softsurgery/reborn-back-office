import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const usePermissions = () => {
  const { isFetching: isFetchPermissionsPending, data: permissionsResp } =
    useQuery({
      queryKey: ["permissions"],
      queryFn: () => api.permission.findAll(),
    });

  const permissions = React.useMemo(() => {
    if (!permissionsResp) return [];
    return permissionsResp;
  }, [permissionsResp]);

  return {
    permissions,
    isFetchPermissionsPending,
  };
};