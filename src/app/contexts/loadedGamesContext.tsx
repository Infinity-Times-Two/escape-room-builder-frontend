'use client';
import { useState, useEffect, useMemo, createContext, PropsWithChildren } from 'react';

import { Game } from '../types/types'

interface LoadedGamesContextType {
  loadedGames: Game[];
  setLoadedGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loading: boolean;
}

const defaultContextValue: LoadedGamesContextType = {
  loadedGames: [],
  setLoadedGames: () => {},
  loading: false,
};

const LoadedGamesContext = createContext(defaultContextValue);

const LoadedGamesContextProvider = (props: PropsWithChildren<{}>) => {

  const [loadedGames, setLoadedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Fetch data from the server
      const response = await fetch('/api/games');
      const data = await response.json();
      setLoadedGames(data.games);
      setLoading(false)
      return data;
    };
    
    fetchData()
  }, [])



  const value = useMemo(
    () => ({
      loading,
      loadedGames,
      setLoadedGames,
    }),
    [loadedGames, setLoadedGames, loading]
  );

  return (
    <LoadedGamesContext.Provider value={value}>
      {props.children}
    </LoadedGamesContext.Provider>
  );
};

export { LoadedGamesContext, LoadedGamesContextProvider };
