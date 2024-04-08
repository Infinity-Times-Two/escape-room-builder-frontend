import NewGameForm from '../components/createGame/NewGameForm';
import Link from 'next/link';
import { auth, SignedIn } from '@clerk/nextjs';

export default function NewGame() {
  const currentUser = auth();
  return (
    <div className='flex flex-col items-center justify-start mx-4 py-4 sm:mx-16 min-h-screen sm:min-w-[80%] sm:mx-16 gap-8'>
      <SignedIn>
        <p className='text-center'>
          You can create and save a game on your device without logging in.
        </p>
        <p className='text-center'>
          If you want to share your game with others or across devices,
          <br /> please <Link href='/sign-in'>Sign In</Link> or{' '}
          <Link href='/sign-up'>Sign Up</Link>.
        </p>
      </SignedIn>
      <NewGameForm />
    </div>
  );
}
