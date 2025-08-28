import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useJobCategories = (enabled?: boolean) => {
  const {
    data: jobCategoriesResp,
    isFetching: isFetchJobCategoriesPending,
    refetch: refetchJobCategories,
  } = useQuery({
    queryKey: ["job-categories"],
    queryFn: () => api.jobCategory.findAll(),
    enabled,
  });

  const jobCategories = React.useMemo(() => {
    if (!jobCategoriesResp) return [];
    return jobCategoriesResp;
  }, [jobCategoriesResp]);

  return {
    jobCategories,
    isFetchJobCategoriesPending,
    refetchJobCategories,
  };
};
