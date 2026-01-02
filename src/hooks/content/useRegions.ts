import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useRegionsProps {
  enabled?: boolean;
}

export const useRegions = ({ enabled = true }: useRegionsProps = {}) => {
  const {
    isFetching: isFetchRegionsPending,
    data: regionsResp,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: `refType.label||$eq||Region`,
      }),
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
