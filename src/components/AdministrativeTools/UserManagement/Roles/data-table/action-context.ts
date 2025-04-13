import React from "react";

interface RoleActionsContextProps {
    openCreateRoleSheet: () => void;
    openUpdateRoleSheet: () => void;
    openDeleteRoleDialog: () => void;
    openDuplicateRoleDialog: () => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    page: number;
    totalPageCount: number;
    setPage: (value: number) => void;
    size: number;
    setSize: (value: number) => void;
    order: boolean;
    sortKey: string;
    setSortDetails: (order: boolean, sortKey: string) => void;
}

export const RoleActionsContext = React.createContext<Partial<RoleActionsContextProps>>({});
export const useRoleActions =  () => React.useContext(RoleActionsContext)