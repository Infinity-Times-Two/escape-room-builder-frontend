'use client';
import {
  useState,
  useContext,
  useEffect,
  createContext,
  useMemo,
  PropsWithChildren,
} from 'react';
import { UserContext } from './userContext';
import { Game } from '../types/types';

interface SavedGamesContextType {
  savedGames: Game[];
  setSavedGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loadingSavedGames: boolean;
}

const defaultContextValue: SavedGamesContextType = {
  savedGames: [],
  setSavedGames: () => {},
  loadingSavedGames: false,
};

const SavedGamesContext = createContext(defaultContextValue);

const SavedGamesContextProvider = (props: PropsWithChildren<{}>) => {
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [loadingSavedGames, setLoadingSavedGames] = useState<boolean>(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // console.log('user: ', user);
    const fetchData = async () => {
      setLoadingSavedGames(true);
      const response = await fetch(`/api/games/${user.id}`);
      console.log(`fetching saved games from /api/games/${user.id}`);
      const data = await response.json();
      setSavedGames(data.Items);
      setLoadingSavedGames(false);
      return data;
    };
    if (user.id) {
      fetchData();
    } else {
      setLoadingSavedGames(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      savedGames,
      setSavedGames,
      loadingSavedGames,
    }),
    [savedGames, setSavedGames, loadingSavedGames]
  );

  return (
    <SavedGamesContext.Provider value={value}>
      {props.children}
    </SavedGamesContext.Provider>
  );
};

export { SavedGamesContext, SavedGamesContextProvider };
