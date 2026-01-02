import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useJobCategoriesProps {
  enabled?: boolean;
}

export const useJobCategories = ({
  enabled = true,
}: useJobCategoriesProps = {}) => {
  const {
    data: jobCategoriesResp,
    isFetching: isFetchJobCategoriesPending,
    refetch: refetchJobCategories,
  } = useQuery({
    queryKey: ["job-categories"],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: `refType.label||$eq||Job Category`,
      }),
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
