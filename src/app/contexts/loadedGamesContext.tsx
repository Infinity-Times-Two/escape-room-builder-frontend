'use client';
import { useState, createContext, useMemo, PropsWithChildren } from 'react';

import { Game } from '../types/types'

interface LoadedGamesContextType {
  loadedGames: Game[] | undefined;
  setLoadedGames: React.Dispatch<React.SetStateAction<Game[] | undefined>>;
}

const defaultContextValue: LoadedGamesContextType = {
  loadedGames: [],
  setLoadedGames: () => {},
};

const LoadedGamesContext = createContext(defaultContextValue);

const LoadedGamesContextProvider = (props: PropsWithChildren<{}>) => {

  const [loadedGames, setLoadedGames] = useState<Game[] | undefined>([]);

  const value = useMemo(
    () => ({
      loadedGames,
      setLoadedGames,
    }),
    [loadedGames, setLoadedGames]
  );

  return (
    <LoadedGamesContext.Provider value={value}>
      {props.children}
    </LoadedGamesContext.Provider>
  );
};

export { LoadedGamesContext, LoadedGamesContextProvider };
