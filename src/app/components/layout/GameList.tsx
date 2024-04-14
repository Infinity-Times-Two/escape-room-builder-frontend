'use client';
import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { useContext, useEffect } from 'react';
import { LoadedGamesContext } from '@/app/contexts/loadedGamesContext';
import { Game } from '@/app/types/types';

export default function GameList() {
  const { loadedGames, setLoadedGames } = useContext(LoadedGamesContext);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (Array.isArray(data.games)) {
        setLoadedGames(data.games);
        localStorage.setItem('loadedGames', JSON.stringify(data.games));
      }
    };
    if (!loadedGames) {
      fetchRooms();
    }
  }, [loadedGames, setLoadedGames]);

  return (
    <div className='flex flex-col justify-center row-wrap max-w-7xl self-start gap-8'>
      <div className='overflow-x-auto'>
        <table className='table'>
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Author</th>
              <th>Challenges</th>
              <th>Time Limit</th>
            </tr>
          </thead>
          <tbody>
            {loadedGames &&
              loadedGames.map((game: Game, index) => (
                <tr key={game.id}>
                  <th>
                    <Link
                      key={game.id}
                      href={`/game/${game.id}`}
                      className='hover:no-underline'
                      data-test={`game-card-${index}`}
                    >
                      {game.gameTitle}{' '}
                    </Link>
                  </th>
                  <td>{game.gameDescription}</td>
                  <td>{game.author}</td>
                  <td>{game.challenges.length}</td>
                  <td>{game.timeLimit}</td>
                </tr>
              ))}
            {/* <GameCard
              roomName={game.gameTitle}
              author={game.author}
              theme={game.theme}
              challenges={game.challenges.length}
              timeLimit={game.timeLimit}
              description={game.gameDescription}
              titleBackgroundColor={game.titleBg}
              bodyBackgroundColor={game.bodyBg}
            /> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
