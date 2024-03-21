import GameCardSkeleton from '../ui/GameCardSkeleton';

export default function LoadingRooms() {
  return (
    <div className='flex flex-row flex-wrap justify-center row-wrap max-w-7xl self-start gap-8'>
      <GameCardSkeleton />
      <GameCardSkeleton />
      <GameCardSkeleton />
    </div>
  );
}
