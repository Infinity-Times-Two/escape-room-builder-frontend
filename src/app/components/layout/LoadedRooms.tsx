'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from '../ui/GameCard';

interface Game {
  id: string;
  gameTitle: string;
  gameDescription: string;
  timeLimit: number;
  theme: string;
  author: string;
  titleBg: string;
  bodyBg: string;
  numberOfChallenges: number;
}

interface Challenge {
  id: string;
  type: string;
  description: string;
  clue: string | Array<string>;
  answer: string;
}

export default function SavedRooms() {
  const [games, setGames] = useState<Game[]>();

  const fetchGames = async () => {
    const response = await fetch('/api/games');
    console.log(response);
    const data = await response.json();
    console.log(data.games);
    setGames(data.games);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className='flex flex-row nowrap overflow-auto max-w-full self-start px-8 gap-8'>
      {games &&
        games.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className='hover:no-underline'
          >
            <GameCard
              roomName={game.gameTitle}
              author={game.author}
              theme={game.theme}
              challenges={game.numberOfChallenges}
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
