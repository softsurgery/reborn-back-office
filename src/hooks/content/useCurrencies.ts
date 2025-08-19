import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useCurrencies = (enabled?: boolean) => {
  const {
    data: currenciesResp,
    isFetching: isFetchCurrenciesPending,
    refetch: refetchCurrencies,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => api._public.currency.findAll(),
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
