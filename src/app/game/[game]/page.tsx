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

    const localStorageGame: any = localStorage.getItem('singleGame');
    const localStorageSavedGames: any = localStorage.getItem('savedGames');
    const localStorageLoadedGames: any = localStorage.getItem('loadedGames');
    const localStorageSingleGame: Game = JSON.parse(localStorageGame)
    const savedGamesArray: Game[] | null = JSON.parse(localStorageSavedGames);
    const loadedGamesArray: Game[] | null = JSON.parse(localStorageLoadedGames);


    // Check if the game is saved
    if (savedGamesArray) {
      const savedGame: Game | undefined = savedGamesArray?.find(
        (game) => game.id === params.game
      );
      if (savedGame) {
        setSingleGame(savedGame);
      }
    }

    // Check if the game was already loaded
    if (loadedGamesArray) {
      const loadedGame: Game | undefined = loadedGamesArray?.find(
        (game) => game.id === params.game
      );
      if (loadedGame) {
        console.log('found local game')
        setSingleGame(loadedGame);
      }
    }

    // Check if it's the single game already loaded to be played
    if (localStorageSingleGame?.id === params.game) {
      console.log('loading game from Single Game')
      const parsedGame = JSON.parse(localStorageGame);
      setSingleGame(parsedGame);
    } else {
      // Otherwise, fetch from the DB
      console.log('fetching from DB')
      fetchSingleGame();
    }
  }, [setSingleGame, params.game]);

  // const { savedGames } = useContext(SavedGamesContext);
  // const { loadedGames } = useContext(LoadedGamesContext);

  // const loadedGame: Game | undefined = loadedGames?.find(
  //   (game) => game.id === params.game
  // );

  // if (loadedGame) {
  //   currentGame = loadedGame;
  // } else if (savedGame) {
  //   currentGame = savedGame;
  // } else if (singleGame) {
  //   currentGame = singleGame;
  // }

  const { setExpiry } = useContext(TimerContext);

  if (!singleGame && !loading) {
    return (
      <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    );
  }

  console.log(`Current time: ${Date.now()}`);
  console.log(`Expiry time: ${Date.now() + singleGame.timeLimit * 1000}`);

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
          <Link
            href={`./${singleGame.id}/${singleGame.challenges[0].id}`}
            data-test='start-game'
          >
            <button
              className='xl'
              onClick={() =>
                setExpiry(
                  Date.now() +
                    (singleGame && singleGame.timeLimit
                      ? singleGame?.timeLimit * 1000
                      : 600)
                )
              }
            >
              <span>Play</span>
            </button>
          </Link>

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
