'use client';
import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { useContext, useEffect } from 'react';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { Game } from '@/app/types/types';

export default function SavedRooms() {
  const { savedGames, setSavedGames } = useContext(SavedGamesContext);

  useEffect(() => {
    const localStorageSavedGames: any = localStorage.getItem('savedGames');
    let defaultSavedGames: Game[] = [];
    if (localStorageSavedGames !== null) {
      defaultSavedGames = JSON.parse(localStorageSavedGames);
    }
    setSavedGames(defaultSavedGames)
  }, [setSavedGames]);
  if (savedGames.length === 0) {
    return <p>No saved games</p>;
  }
  return (
    <div className='flex flex-col nowrap max-w-7xl self-start gap-4 w-full'>
      <h2>Your saved games:</h2>
      <div className='flex flex-row nowrap gap-8'>
        {savedGames.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className='hover:no-underline'
          >
            <GameCard
              roomName={game.gameTitle}
              author={game.author}
              theme={game.theme}
              challenges={game.challenges.length}
              timeLimit={game.timeLimit}
              description={game.gameDescription}
              titleBackgroundColor={game.titleBg}
              bodyBackgroundColor={game.bodyBg}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
