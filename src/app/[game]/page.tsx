import Link from 'next/link';
import { mockSavedGames } from '../contexts/mockSavedGames';

export default function Game({ params }: { params: { game: string } }) {
  const currentGame = mockSavedGames.find(
    (game) => game.id === Number(params.game)
  );

  if(!currentGame) {
    return (
      <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    )
  }

  const timeInMinutes = (currentGame.timeLimit / 60).toFixed(2);
  const formattedTime = parseFloat(timeInMinutes);
  return (
    <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
      <h2>{currentGame.gameTitle}</h2>
      <p>{currentGame.gameDescription}</p>
      <Link href={`./${currentGame.id + '/' + currentGame.challenges[0].id}`}>
        <button className='xl'>
          <span>Play</span>
        </button>
      </Link>
      <div className='chip'>
        <span>{formattedTime} minutes</span>
      </div>
      <div className='chip'>
        <span>{currentGame.numberOfChallenges} challenges</span>
      </div>
    </div>
  );
}
