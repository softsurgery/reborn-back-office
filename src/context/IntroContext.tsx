import React from "react";

interface IntroContextProps {
  title: string;
  description: string;
  setIntro: (title: string, description: string) => void;
  clearIntro: () => void;
}

export const IntroContext = React.createContext<Partial<IntroContextProps>>({});

export const useIntro = () => React.useContext(IntroContext);
