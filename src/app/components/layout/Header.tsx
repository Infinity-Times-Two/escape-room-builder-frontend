'use client';
import { useEffect, useContext } from 'react';
import { UserContext } from '@/app/contexts/userContext';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { DBuser } from '@/app/types/types';

export default function Header() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const createUser = async (userId: string | undefined) => {
      console.log('Creating user...');
      const response = await fetch(`/api/createUser/${userId}`);
      const data = await response.json();
      console.log('Response from createUser:');
      console.log(data);

      return data;
    };
    const fetchUser = async (id: string | undefined | null) => {
      if (id !== null && id !== undefined) {
        // console.log(`Looking for user with id ${id}`);
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        console.log('Response from fetching user data on the front-end:');
        console.log(data);
        setUser({
          id: data.userId,
          firstName: data.firstName,
          nickName: data.nickName,
          savedGames: data.savedGames,
          createdGames: data.createdGames,
          isAdmin: data.isAdmin,
        });
        if (data?.message === 'User not found') {
          createUser(id);
          const response = await fetch(`/api/user/${id}`);
          const data = await response.json();
          setUser({
            id: data.userId,
            firstName: data.firstName,
            nickName: data.nickName,
            savedGames: data.savedGames,
            createdGames: data.createdGames,
            isAdmin: data.isAdmin,
          });
          return data;
        }
        return data;
      } else {
        console.log('No user info');
      }
    };

    fetchUser(userId);
  }, [userId, setUser]);

  return (
    <header className='grid grid-cols-1 sm:grid-cols-2 items-center border-b border-black sm:px-16'>
      <h1 className='text-xl xs:text-2xl justify-self-center xs:justify-self-start pt-6 pb-2 sm:pb-6'>
        <Link href='/'>Escape Room Builder</Link>
      </h1>
      <div className='flex flex-row items-center justify-self-center sm:justify-self-end space-x-4 sm:space-x-8 pb-6 pt-2 sm:pt-6'>
        <Link href='/about'>About</Link>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <button data-test='sign-in-button' className='small'>
              <span className='whitespace-nowrap'>Sign in</span>
            </button>
          </SignInButton>
          <SignUpButton mode='modal'>
            <button data-test='sign-out-button' className='small'>
              <span className='whitespace-nowrap'>Sign up</span>
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
