import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useJobTagsProps {
  enabled?: boolean;
}

export const useJobTags = ({ enabled = true }: useJobTagsProps = {}) => {
  const {
    isFetching: isFetchJobTagsPending,
    data: jobTagsResp,
    refetch: refetchJobTags,
  } = useQuery({
    queryKey: ["job-tags"],
    queryFn: () =>
      api.admin.refParam.findAll({ filter: `refType.label||$eq||Job Tag` }),
    enabled,
  });

  const jobTags = React.useMemo(() => {
    if (!jobTagsResp) return [];
    return jobTagsResp;
  }, [jobTagsResp]);

  return {
    jobTags,
    isFetchJobTagsPending,
    refetchJobTags,
  };
};
