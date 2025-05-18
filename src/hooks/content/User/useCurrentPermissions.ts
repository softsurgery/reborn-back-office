import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentPermissions = (
  permissions: string[],
  enabled?: boolean
) => {
  const { user, isFetchUserPending } = useCurrentUser();
  const {
    isFetching: isFetchingGranted,
    data: grantedResp,
    refetch: refetchGranted,
  } = useQuery({
    queryKey: ["has-permissions", user?.id, permissions],
    queryFn: () => api.admin.user.hasPermissions(user?.id, permissions),
    enabled: enabled && !!user?.id,
  });

  const granted = React.useMemo(() => {
    return grantedResp?.data || false;
  }, [grantedResp]);

  return {
    granted,
    isFetchingGranted,
    refetchGranted,
  };
};
