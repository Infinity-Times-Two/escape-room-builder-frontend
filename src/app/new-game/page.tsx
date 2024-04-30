import NewGameForm from '../components/createGame/NewGameForm';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';

export default function NewGame() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-8 w-full'>
      <SignedOut>
        <div role='alert' className='alert alert-info w-9/12 mx-20'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='stroke-current shrink-0 w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <span>
            You can create and save a game on your device without logging in. If
            you want to share your game with others or across devices,
            please <Link href='/sign-in'>Sign In</Link> or{' '}
            <Link href='/sign-up'>Sign Up</Link>.
          </span>
        </div>
      </SignedOut>
      <NewGameForm />
    </div>
  );
}
