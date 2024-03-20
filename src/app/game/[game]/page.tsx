'use client';
import Link from 'next/link';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { LoadedGamesContext } from '@/app/contexts/loadedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import { useContext, useEffect, useState } from 'react';
import { TimerContext } from '../../contexts/timerContext';
import { Game } from '@/app/types/types';

export default function PlayGame({ params }: { params: { game: string } }) {
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  const { savedGames, setSavedGames } = useContext(SavedGamesContext);
  const { loadedGames, setLoadedGames } = useContext(LoadedGamesContext);
  const [loading, setLoading] = useState(false);

  // Set state if game in localStorage exists, otherwise fetch from DB
  useEffect(() => {
    const fetchSingleGame = async () => {
      setLoading(true);
      const response = await fetch(`/api/game/${params.game}`);
      const data = await response.json();
      console.log('Fetched game data from the server.');
      setSingleGame(data);
      localStorage.setItem('singleGame', JSON.stringify(data));
      setLoading(false);
    };

    // Grab everything from LS in case it's not in state (eg. brand new user arrives at this page from a shared link)
    const localStorageGame: any = localStorage.getItem('singleGame');
    const localStorageSavedGames: any = localStorage.getItem('savedGames');
    const localStorageLoadedGames: any = localStorage.getItem('loadedGames');

    const localStorageSingleGame: Game | null = JSON.parse(localStorageGame);
    const savedGamesArray: Game[] | null = JSON.parse(localStorageSavedGames);
    const loadedGamesArray: Game[] | null = JSON.parse(localStorageLoadedGames);

    // Check if the game is saved
    if (savedGamesArray) {
      const savedGame: Game | undefined = savedGamesArray?.find(
        (game) => game.id === params.game
      );
      setSavedGames(savedGamesArray);
      if (savedGame) {
        console.log('Found from saved games');
        setSingleGame(savedGame);
      }
    }

    // Check if the game was already loaded
    if (loadedGamesArray) {
      const loadedGame: Game | undefined = loadedGamesArray?.find(
        (game) => game.id === params.game
      );
      setLoadedGames(loadedGamesArray);
      if (loadedGame) {
        console.log('Found from loaded games');
        setSingleGame(loadedGame);
      }
    }

    // Check if it's the single game already loaded to be played
    if (singleGame.id === params.game) {
      console.log('Game already in state');
    } else if (localStorageSingleGame?.id === params.game) {
      const parsedGame = JSON.parse(localStorageGame);
      console.log('Grabbed Single Game from local storage');
      setSingleGame(parsedGame);
    } else {
      // Otherwise, fetch from the DB
      console.log('Fetching game from DB');
      fetchSingleGame();
    }
  }, [
    setSingleGame,
    setSavedGames,
    setLoadedGames,
    params.game,
    singleGame.id,
  ]);

  const { setExpiry } = useContext(TimerContext);

  if (!singleGame && !loading) {
    return (
      <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    );
  }

  const timeInMinutes = (singleGame.timeLimit / 60).toFixed(2);
  const formattedTime = parseFloat(timeInMinutes);

  return (
    <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{singleGame.gameTitle}</h2>
          <p>{singleGame.gameDescription}</p>
          <div className='flex flex-row justify-center gap-8'>
            <Link
              href={`/edit/${singleGame.id}`}
              data-test='edit-game'
            >
              <button
                className='xl'
              >
                <span>Edit</span>
              </button>
            </Link>
            <Link
              href={`./${singleGame.id}/${singleGame.challenges[0].id}`}
              data-test='start-game'
            >
              <button
                className='xl green'
                onClick={() =>
                  setExpiry(Date.now() + singleGame.timeLimit * 1000)
                }
              >
                <span>Play</span>
              </button>
            </Link>
          </div>

          <div className='chip'>
            <span>{formattedTime} minutes</span>
          </div>
          <div className='chip'>
            <span>{singleGame.challenges.length} challenges</span>
          </div>
        </>
      )}
    </div>
  );
}
