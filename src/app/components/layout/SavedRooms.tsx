'use client';
import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { useContext } from 'react';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';

export default function SavedRooms() {
  const { savedGames } = useContext(SavedGamesContext)
  return (
    <div className='flex flex-row nowrap overflow-auto max-w-7xl self-start gap-8'>
      {savedGames.map((game) => (
        <Link key={game.id} href={`/game/${game.id}`} className='hover:no-underline'>
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
