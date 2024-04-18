import NewGameForm from '../components/createGame/NewGameForm';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';

export default function NewGame() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-8'>
      <SignedOut>
        <p className='text-center'>
          You can create and save a game on your device without logging in.
        </p>
        <p className='text-center'>
          If you want to share your game with others or across devices,
          <br /> please <Link href='/sign-in'>Sign In</Link> or{' '}
          <Link href='/sign-up'>Sign Up</Link>.
        </p>
      </SignedOut>
      <NewGameForm />
    </div>
  );
}
