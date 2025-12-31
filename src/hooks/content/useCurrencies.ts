import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useCurrenciesProps {
  enabled?: boolean;
}

export const useCurrencies = ({ enabled = true }: useCurrenciesProps = {}) => {
  const {
    data: currenciesResp,
    isFetching: isFetchCurrenciesPending,
    refetch: refetchCurrencies,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: () =>
      api.admin.refParam.findAll({ filter: `refType.label||$eq||Currency` }),
    enabled,
  });

  const currencies = React.useMemo(() => {
    if (!currenciesResp) return [];
    return currenciesResp;
  }, [currenciesResp]);

  return {
    currencies,
    isFetchCurrenciesPending,
    refetchCurrencies,
  };
};
