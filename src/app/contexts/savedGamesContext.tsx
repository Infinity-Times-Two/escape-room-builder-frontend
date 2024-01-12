/*************
 * 
 * This file is currently not in use
 * 
 */

import { useState, createContext, useMemo, PropsWithChildren } from 'react';
import { mockSavedGames } from './mockSavedGames';

type Game = {
  id: string;
  gameTitle: string;
  gameDescription: string;
  timeLimit: number; 
  theme: string;
  author: string;
  titleBg: string;
  bodyBg: string;
  challenges: Challenge[];
};

type Challenge = {
  id: string;
  type: string;
  description: string;
  clue: string | Array<string>;
  answer: string;
};

interface SavedGamesContextType {
  savedGames: Game[];
  setSavedGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const defaultContextValue: SavedGamesContextType = {
  savedGames: mockSavedGames,
  setSavedGames: () => {},
};

const SavedGamesContext = createContext(defaultContextValue);

const SavedGamesContextProvider = (props: PropsWithChildren<{}>) => {

  const [savedGames, setSavedGames] = useState<Game[]>(mockSavedGames);

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
