import React from "react";

interface UiContextProps {
  scrollable: boolean;
  hideScrollbar: boolean;
  paddingX: string;
  scrollElement: HTMLElement | null;
  hideHeaderOnScroll: boolean;
  hidePageHeaderOnScroll: boolean;
  hidePageHeader: boolean;

  setScrollable: (scrollable: boolean) => void;
  clearScrollable: () => void;

  setHideScrollbar: (hideScrollbar: boolean) => void;
  clearHideScrollbar: () => void;

  setPaddingX: (paddingX: string) => void;
  clearPaddingX: () => void;

  setScrollElement: (element: HTMLElement | null) => void;
  clearScrollElement: () => void;

  setHideHeaderOnScroll: (hideHeaderOnScroll: boolean) => void;
  clearHideHeaderOnScroll: () => void;

  setHidePageHeaderOnScroll: (hidePageHeaderOnScroll: boolean) => void;
  clearHidePageHeaderOnScroll: () => void;

  setHidePageHeader: (hidePageHeader: boolean) => void;
  clearHidePageHeader: () => void;

  clearUi: () => void;
}

export const UiContext = React.createContext<Partial<UiContextProps>>({});

export const useUi = () => React.useContext(UiContext);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [scrollable, setScrollable] = React.useState<boolean>(false);
  const [hideScrollbar, setHideScrollbar] = React.useState<boolean>(false);
  const [paddingX, setPaddingX] = React.useState<string>("");
  const [scrollElement, setScrollElement] = React.useState<HTMLElement | null>(
    null,
  );
  const [hideHeaderOnScroll, setHideHeaderOnScroll] = React.useState<boolean>(true);
  const [hidePageHeaderOnScroll, setHidePageHeaderOnScroll] = React.useState<boolean>(true);
  const [hidePageHeader, setHidePageHeader] = React.useState<boolean>(false);

  const clearScrollable = React.useCallback(() => setScrollable(false), []);
  const clearHideScrollbar = React.useCallback(
    () => setHideScrollbar(false),
    [],
  );
  const clearPaddingX = React.useCallback(() => setPaddingX(""), []);
  const clearScrollElement = React.useCallback(
    () => setScrollElement(null),
    [],
  );
  const clearHideHeaderOnScroll = React.useCallback(
    () => setHideHeaderOnScroll(true),
    [],
  );
  const clearHidePageHeaderOnScroll = React.useCallback(
    () => setHidePageHeaderOnScroll(true),
    [],
  );
  const clearHidePageHeader = React.useCallback(
    () => setHidePageHeader(false),
    [],
  );
  const clearUi = React.useCallback(() => {
    setScrollable(false);
    setHideScrollbar(false);
    setPaddingX("");
    setScrollElement(null);
    setHideHeaderOnScroll(true);
    setHidePageHeaderOnScroll(true);
    setHidePageHeader(false);
  }, []);

  const value = React.useMemo(
    () => ({
      scrollable,
      hideScrollbar,
      paddingX,
      scrollElement,
      hideHeaderOnScroll,
      hidePageHeaderOnScroll,
      hidePageHeader,
      setScrollable,
      clearScrollable,
      setHideScrollbar,
      clearHideScrollbar,
      setPaddingX,
      clearPaddingX,
      setScrollElement,
      clearScrollElement,
      setHideHeaderOnScroll,
      clearHideHeaderOnScroll,
      setHidePageHeaderOnScroll,
      clearHidePageHeaderOnScroll,
      setHidePageHeader,
      clearHidePageHeader,
      clearUi,
    }),
    [
      scrollable,
      hideScrollbar,
      paddingX,
      scrollElement,
      hideHeaderOnScroll,
      hidePageHeaderOnScroll,
      hidePageHeader,
      clearScrollable,
      clearHideScrollbar,
      clearPaddingX,
      clearScrollElement,
      clearHideHeaderOnScroll,
      clearHidePageHeaderOnScroll,
      clearHidePageHeader,
      clearUi,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};
