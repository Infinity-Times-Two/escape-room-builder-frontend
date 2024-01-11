import Link from 'next/link';
import GameCard from '../ui/GameCard';
import { mockSavedGames } from '../../contexts/mockSavedGames';

export default function SavedRooms() {
  return (
    <div className='flex flex-row nowrap overflow-auto max-w-full self-start px-8 gap-8'>
      {mockSavedGames.map((game) => (
        <Link key={game.id} href={`/${game.id}`} className='hover:no-underline'>
          <GameCard
            roomName={game.gameTitle}
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
