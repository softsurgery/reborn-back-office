import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface useConfigurationProps {
  id: string;
  enabled?: boolean;
}

export const useConfiguration = ({ id, enabled }: useConfigurationProps) => {
  const {
    data: configurationResponse,
    isPending: isConfigurationPending,
    refetch: refetchConfiguration,
  } = useQuery({
    queryKey: ["configuration", id],
    queryFn: () => api.admin.configuration.findOneById(id),
    enabled,
  });

  const configuration = React.useMemo(
    () => configurationResponse || null,
    [configurationResponse],
  );

  return { configuration, isConfigurationPending, refetchConfiguration };
};
