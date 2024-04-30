'use client';
// import { Suspense } from 'react';
import SavedRooms from '../components/layout/SavedRooms';
import LoadedRooms from '../components/layout/LoadedRooms';
import Card from '../components/ui/Card';
import { useState, useContext, useEffect } from 'react';
import { LoadedGamesContext } from '../contexts/loadedGamesContext';
import { SavedGamesContext } from '../contexts/savedGamesContext';
import { Game } from '../types/types';
import { colorVariants } from '../components/ui/colorVariants';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStopwatch,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';

export default function Play() {
  const [showRooms, setShowRooms] = useState<string>('public');
  const active = `tab-active text-white [--tab-bg:indigo] [--tab-border-color:indigo]`;
  const { loadedGames, loading } = useContext(LoadedGamesContext);
  const { savedGames, loadingSavedGames } = useContext(SavedGamesContext);

  const GameList = ({ games }: { games: Game[] }) => {
    return (
      <div
        className={`flex flex-col border-2 rounded-xl bg-indigo-400 p-8 border-black bg-white w-full justify-between border-b-2`}
      >
        <div className='flex flex-col gap-8 w-full'>
          {loading || loadingSavedGames && <p>loading...</p>}
          {!loading && games?.length === 0 && (
            <p>
              No games... <Link href='/new-game'>Create one!</Link>
            </p>
          )}
          {games?.map((game, index) => {
            return (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className='hover:no-underline'
                data-test={`game-card-${index}`}
              >
                <div className='rounded-xl bg-black self-start'>
                  <div
                    className={`flex flex-col gap-4 border-2 rounded-xl p-8 border-black ${
                      colorVariants[game.titleBg]
                    } md:flex-row w-full justify-between border-b-2 -translate-x-1 -translate-y-1 hover:-translate-y-2 hover:-translate-x-2 transition-all`}
                  >
                    <div className='flex flex-col items-start'>
                      <h3 className='text-xl text-left'>{game.gameTitle}</h3>
                      <p className='text-xs text-neutral-500'>{game.author}</p>
                      {game.gameDescription && <p>{game.gameDescription}</p>}
                    </div>
                    <div className='flex flex-row justify-center gap-4'>
                      <div className='flex flex-col items-center gap-2 text-indigo-950'>
                        <span className='text-4xl'>
                          <FontAwesomeIcon icon={faCircleQuestion} />
                        </span>
                        <p className='text-nowrap'>
                          {game.challenges?.length +
                            ' ' +
                            (game.challenges?.length > 1
                              ? 'challenges'
                              : 'challenge')}
                        </p>
                      </div>
                      <div className='flex flex-col items-center gap-2 text-indigo-950'>
                        <span className='text-4xl'>
                          <FontAwesomeIcon icon={faStopwatch} />
                        </span>
                        <p className='text-nowrap'>
                          {game.timeLimit / 60} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-8 w-11/12 md:w-3/4 xl:w-1/2'>
      <h1 className='text-8xl'>Choose A Quiz</h1>
      <div
        role='tablist'
        className='tabs tabs-boxed justify-center p-2 bg-indigo-800/75'
      >
        <a
          role='tab'
          className={`tab hover:no-underline border-none text-white ${
            showRooms === 'public' ? active : null
          }`}
          onClick={() => setShowRooms('public')}
        >
          Public Rooms
        </a>
        <a
          role='tab'
          className={`tab hover:no-underline border-none text-white ${
            showRooms === 'private' ? active : null
          }`}
          onClick={() => setShowRooms('private')}
          data-test='your-rooms'
        >
          Your Rooms
        </a>
      </div>
      {showRooms === 'public' ? (
        <GameList games={loadedGames} />
      ) : (
        <GameList games={savedGames} />
      )}
    </div>
  );
}
