'use server';
import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { Game } from '@/app/types/types';

async function getData() {
  
  const res = await fetch(`${process.env.URL}/api/games`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json();
}

export default async function PublicRooms() {
  const { games } = await getData();
  return (
    <div className='flex flex-row flex-wrap justify-center row-wrap max-w-7xl self-start gap-8'>
      {games.map((game: Game, index: number) => (
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
