import SavedRooms from '../components/layout/SavedRooms';

export default function Play() {
  return (
    <div className='flex flex-col items-center justify-start py-16 min-h-screen gap-8'>
      <h1 className='text-4xl font-bold'>Play</h1>
      <h2>Your Saved Rooms:</h2>
      <SavedRooms />
    </div>
  );
}
