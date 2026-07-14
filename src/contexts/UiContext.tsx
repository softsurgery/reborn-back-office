import React from "react";

interface UiContextProps {
  scrollable: boolean;
  setScrollable: (scrollable: boolean) => void;
  clearScrollable: () => void;
  clearUi: () => void;
}

export const UiContext = React.createContext<Partial<UiContextProps>>({});

export const useUi = () => React.useContext(UiContext);
