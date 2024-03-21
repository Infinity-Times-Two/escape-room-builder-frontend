import { Suspense } from 'react';
import SavedRooms from '../components/layout/SavedRooms';
import LoadedRooms from '../components/layout/LoadedRooms';
import LoadingRooms from '../components/layout/LoadingRooms';
export default function Play() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-8'>
      <h1>Play</h1>
      <Suspense fallback={<LoadingRooms />}>
        <LoadedRooms />
      </Suspense>
      <SavedRooms />
    </div>
  );
}
