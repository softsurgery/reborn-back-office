import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useJobTags = (enabled?: boolean) => {
  const {
    isFetching: isFetchJobTagsPending,
    data: jobTagsResp,
    refetch: refetchJobTags,
  } = useQuery({
    queryKey: ["job-tags"],
    queryFn: () => api.jobTag.findAll(),
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
