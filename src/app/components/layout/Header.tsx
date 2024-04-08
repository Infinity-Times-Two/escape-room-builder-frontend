'use client';
import { useEffect, useContext } from 'react';
import { UserContext } from '@/app/contexts/userContext';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

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
        setUser({
          id: data.userId,
          firstName: data.firstName,
          nickName: data.nickName,
          savedGames: data.savedGames,
          createdGames: data.createdGames,
          isAdmin: data.isAdmin,
        });
        if (typeof data.firstName === 'undefined') {
          const firstName = await updateUser(id);
          setUser((prevUser) => {
            const updatedUser = { ...prevUser, firstName: firstName };
            return updatedUser;
          });
        }

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
        setUser({
          id: '',
          firstName: '',
          nickName: '',
          savedGames: [],
          createdGames: [],
          isAdmin: false,
        });
      }
    };

    fetchUser(userId);
  }, [userId, setUser]);

  return (
    <header className='grid grid-cols-1 sm:grid-cols-2 items-center bg-blue-400/25 border-b border-black sm:px-16'>
      <p className='header'>
        <Link href='/' data-test='home-link'>
          Escape Room Builder
        </Link>
      </p>
      <div className='flex flex-row min-h-[110px] items-center justify-self-center sm:justify-self-end space-x-4 sm:space-x-8 pb-6 pt-2 sm:pt-6'>
        <SignedIn>
            <div className='bg-white p-1 rounded-full hover:bg-emerald-100 transition-all'>
              <UserButton />
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
