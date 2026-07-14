import React from "react";

interface UiContextProps {
  scrollable: boolean;
  hideScrollbar: boolean;
  paddingX: string;

  setScrollable: (scrollable: boolean) => void;
  clearScrollable: () => void;

  setHideScrollbar: (hideScrollbar: boolean) => void;
  clearHideScrollbar: () => void;

  setPaddingX: (paddingX: string) => void;
  clearPaddingX: () => void;

  clearUi: () => void;
}

export const UiContext = React.createContext<Partial<UiContextProps>>({});

export const useUi = () => React.useContext(UiContext);
