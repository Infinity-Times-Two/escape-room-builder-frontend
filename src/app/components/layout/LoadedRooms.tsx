'use client';
import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { useContext, useEffect } from 'react';
import { LoadedGamesContext } from '@/app/contexts/loadedGamesContext';
import { Game } from '@/app/types/types';
import GameCardSkeleton from '../ui/GameCardSkeleton';

export default function LoadedRooms() {
  const { loadedGames, setLoadedGames } = useContext(LoadedGamesContext);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (Array.isArray(data.games)) {
        setLoadedGames(data.games);
        localStorage.setItem('loadedGames', JSON.stringify(data.games))
      }
    };
    fetchRooms();
  }, [setLoadedGames]);
  
  return (
    <div className='flex flex-row flex-wrap justify-center row-wrap max-w-7xl self-start gap-8'>
      {loadedGames &&
        loadedGames.map((game: Game, index) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className='hover:no-underline'
            data-test={`game-card-${index}`}
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
  );
}
