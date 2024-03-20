import NewGameForm from '../../components/createGame/NewGameForm';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function EditGame({ params }: { params: { gameId: string } }) {
  return (
    <div className='flex flex-col items-center justify-start mx-4 py-4 sm:mx-16 min-h-screen sm:min-w-[80%] sm:mx-16 gap-8'>
      <SignedOut>
        <p>Please <Link href='/sign-in'>Sign In</Link> to edit this game.</p>
      </SignedOut>
      <SignedIn>
        <NewGameForm editGame={params.gameId} />
      </SignedIn>
    </div>
  );
}
