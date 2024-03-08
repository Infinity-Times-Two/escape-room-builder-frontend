'use client';
import { useState, useEffect, createContext, useMemo, PropsWithChildren } from 'react';

import { SingleGame } from "../types/types";

interface SingleGameContextType {
  singleGame: SingleGame | undefined;
  setSingleGame: React.Dispatch<React.SetStateAction<SingleGame | undefined>>;
}

const defaultContextValue: SingleGameContextType = {
  singleGame: undefined,
  setSingleGame: () => {},
};

const SingleGameContext = createContext(defaultContextValue);

const SingleGameContextProvider = (props: PropsWithChildren<{}>) => {
  const [singleGame, setSingleGame] = useState<SingleGame | undefined>(undefined);

  const value = useMemo(
    () => ({
      singleGame,
      setSingleGame,
    }),
    [singleGame, setSingleGame]
  )

  return (
    <SingleGameContext.Provider value={value}>
      {props.children}
    </SingleGameContext.Provider>
  )
}

export { SingleGameContext, SingleGameContextProvider };