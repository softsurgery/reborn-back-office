import React from "react";

export type BreadcrumbRoute = { title: string; href?: string };

interface BreadcrumbContextProps {
  routes: BreadcrumbRoute[];
  setRoutes: (routes: BreadcrumbRoute[]) => void;
  clearRoutes: () => void;
  n?: number;
  setN?: (n: number) => void;
}

export const BreadcrumbContext = React.createContext<
  Partial<BreadcrumbContextProps>
>({});

export const useBreadcrumb = () => React.useContext(BreadcrumbContext);

