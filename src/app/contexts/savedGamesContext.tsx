/*************
 * 
 * This file is currently not in use
 * 
 */

import { useState, createContext, useMemo, PropsWithChildren } from 'react';
import { mockSavedGames } from './mockSavedGames';

type Game = {
  id: number;
  gameTitle: string;
  gameDescription: string;
  timeLimit: number; 
  titleBg: string;
  bodyBg: string;
  numberOfChallenges: number;
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
  savedGames: [],
  setSavedGames: () => {},
};

const SavedGamesContext = createContext(defaultContextValue);

const ContextProvider = (props: PropsWithChildren<{}>) => {
  const games = mockSavedGames;

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

export { SavedGamesContext, ContextProvider };
