import React from "react";

export const FeedbackActionsContext = React.createContext({
  openDeleteFeedbackDialog: () => {},
  searchTerm: "",
  setSearchTerm: (_value: string) => {},
  page: 1,
  totalPageCount: 0,
  setPage: (_value: number) => {},
  size: 1,
  setSize: (_value: number) => {},
  order: true,
  sortKey: "",
  setSortDetails: (_order: boolean, _sortKey: string) => {},
});
export const useFeedbackActions = () =>
  React.useContext(FeedbackActionsContext);
