import React from "react";

interface UiContextProps {
  scrollable: boolean;
  hideScrollbar: boolean;
  paddingX: string;
  scrollElement: HTMLElement | null;

  setScrollable: (scrollable: boolean) => void;
  clearScrollable: () => void;

  setHideScrollbar: (hideScrollbar: boolean) => void;
  clearHideScrollbar: () => void;

  setPaddingX: (paddingX: string) => void;
  clearPaddingX: () => void;

  setScrollElement: (element: HTMLElement | null) => void;
  clearScrollElement: () => void;

  clearUi: () => void;
}

export const UiContext = React.createContext<Partial<UiContextProps>>({});

export const useUi = () => React.useContext(UiContext);
