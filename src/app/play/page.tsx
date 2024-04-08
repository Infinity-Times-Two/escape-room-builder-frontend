import { Suspense } from 'react';
import SavedRooms from '../components/layout/SavedRooms';
import LoadingRooms from '../components/layout/LoadingRooms';
import PublicRooms from '../components/layout/PublicRooms';
import LoadedRooms from '../components/layout/LoadedRooms';
import GameList from '../components/layout/GameList';

export default function Play() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-8'>
      <h1 className='text-8xl'>Play</h1>
      <LoadedRooms />
      {/* <Suspense fallback={<LoadingRooms />}>
        <PublicRooms />
      </Suspense> */}
      <SavedRooms />
    </div>
  );
}
