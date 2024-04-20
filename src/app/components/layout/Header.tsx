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
      const response = await fetch(`/api/createUser/${userId}`);
      const data = await response.json();
      return data;
    };

    const updateUser = async (userId: string | undefined) => {
      const response = await fetch(`/api/updateUser/${userId}`);
      const data = await response.json();
      return data;
    };

    const fetchUser = async (id: string | undefined | null) => {
      if (id !== null && id !== undefined) {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        if (data?.message === 'User not found') {
          const createdUser = await createUser(id);
          // const response = await fetch(`/api/user/${id}`);
          // const data = await response.json();
          setUser({
            id: createdUser.userId,
            firstName: createdUser.firstName,
            savedGames: createdUser.savedGames,
            createdGames: createdUser.createdGames,
            isAdmin: createdUser.isAdmin,
            recentGameTimestamps: createdUser.recentGameTimestamps,
          });
        } else {
          setUser({
            id: data.userId,
            firstName: data.firstName,
            savedGames: data.savedGames,
            createdGames: data.createdGames,
            isAdmin: data.isAdmin,
            recentGameTimestamps: data.recentGameTimestamps,
          });
        }
        if (typeof data.firstName === 'undefined') {
          const firstName = await updateUser(id);
          setUser((prevUser: DBuser) => {
            const updatedUser = { ...prevUser, firstName: firstName };
            return updatedUser;
          });
        }
      } else {
        setUser({
          id: '',
          firstName: '',
          savedGames: [],
          createdGames: [],
          isAdmin: false,
          recentGameTimestamps: [],
        });
      }
    };
    fetchUser(userId);
  }, [userId, setUser]);

  return (
    <header className='flex flex-col sm:flex-row items-center gap-4 bg-blue-400/25 border-b border-black py-4 sm:py-6 sm:px-16'>
      <p className='header text-4xl font-black text-center sm:text-left uppercase flex-grow'>
        <Link href='/' data-test='home-link'>
          Quiz Buddies
        </Link>
      </p>
      <div className='flex flex-row items-center justify-self-center sm:justify-self-end space-x-4 sm:space-x-8'>
        <SignedIn>
          <div className='indicator'>
            {user.isAdmin && <span className='indicator-item badge badge-primary text-white text-xs'>admin</span>}
            <div className='bg-white p-1 rounded-full hover:bg-emerald-100 transition-all'>
              <UserButton />
            </div>
          </div>
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
