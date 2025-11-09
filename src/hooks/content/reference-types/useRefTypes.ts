import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useRefTypes = () => {
  const { data: refTypesResp, isFetching: isRefTypesPending } = useQuery({
    queryKey: ["ref-types"],
    queryFn: () => api.admin.refType.findAll(),
  });

  const refTypes = React.useMemo(() => {
    if (!refTypesResp) return [];
    return refTypesResp;
  }, [refTypesResp]);

  return {
    refTypes,
    isRefTypesPending,
  };
};
