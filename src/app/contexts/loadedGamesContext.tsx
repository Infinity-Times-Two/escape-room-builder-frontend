'use client';
import { useState, useEffect, useMemo, createContext, PropsWithChildren } from 'react';

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

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from the server
      const response = await fetch('/api/games');
      const data = await response.json();
      console.log(`setting games: ${data}`)
      setLoadedGames(data.games);
      return data;
    };
    
    fetchData()
  }, [])



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
