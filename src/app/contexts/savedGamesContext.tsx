'use client';
import { useState, createContext, useMemo, PropsWithChildren } from 'react';

import { Game } from '../types/types';

interface SavedGamesContextType {
  savedGames: Game[];
  setSavedGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const defaultContextValue: SavedGamesContextType = {
  savedGames: [],
  setSavedGames: () => {},
};

const SavedGamesContext = createContext(defaultContextValue);

const SavedGamesContextProvider = (props: PropsWithChildren<{}>) => {
  const [savedGames, setSavedGames] = useState<Game[]>([]);

  const value = useMemo(
    () => ({
      savedGames,
      setSavedGames,
    }),
    [savedGames, setSavedGames]
  );

  return (
    <SavedGamesContext.Provider value={value}>
      {props.children}
    </SavedGamesContext.Provider>
  );
};

export { SavedGamesContext, SavedGamesContextProvider };
