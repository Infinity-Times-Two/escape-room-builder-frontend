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
    const fetchData = async () => {
      setLoadingSavedGames(true);
      console.log('user.id: ', user.id);
      const response = await fetch(`/api/games/${user.id}`);
      const data = await response.json();
      console.log('saved games data.Items: ', data.Items)
      setSavedGames(data.Items);
      setLoadingSavedGames(false);
      return data;
    };

    fetchData();
  }, [user.id]);

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
