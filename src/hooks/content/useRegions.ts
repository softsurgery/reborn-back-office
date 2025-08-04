import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useRegions = (enabled?: boolean) => {
  const {
    isFetching: isFetchRegionsPending,
    data: regionsResp,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () => api._public.region.findAll(),
    enabled,
  });

  const regions = React.useMemo(() => {
    if (!regionsResp) return [];
    return regionsResp;
  }, [regionsResp]);

  return {
    regions,
    isFetchRegionsPending,
    refetchRegions,
  };
};
