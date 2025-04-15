interface DataTableRowAdditionalAction<T> {
  actionCallback?: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isActionVisible?: (entity: T) => boolean;
}

export interface DataTableConfig<T> {
  singularName: string;
  pluralName: string;
  //pagination
  page: number;
  size: number;
  totalPageCount: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  //sorting
  order?: boolean;
  sortKey?: string;
  setSortDetails?: (order: boolean, sortKey: string) => void;
  //filtering
  searchTerm?: string;
  setSearchTerm?: (searchTerm: string) => void;
  //actions
  inspectCallback?: () => void;
  createCallback?: () => void;
  updateCallback?: () => void;
  deleteCallback?: () => void;
  additionalActions?: Record<number, DataTableRowAdditionalAction<T>[]>;
  //utility
  targetEntity?: (entity: T) => void;
  invisibleColumns?: string[];
}
