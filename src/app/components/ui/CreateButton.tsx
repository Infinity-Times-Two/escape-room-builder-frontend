'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { SingleGameContext, defaultContextValue } from '@/app/contexts/singleGameContext';

export default function CreateButton() {
  const { setSingleGame } = useContext(SingleGameContext);

  const removeGameFormData = () => {
    localStorage.removeItem('newGameForm');
    setSingleGame(defaultContextValue.singleGame)
  };
  
  return (
    <Link href='/new-game'>
      <button
        data-testid='create'
        data-test='create'
        className='xl green'
        onClick={removeGameFormData}
      >
        <span>Create</span>
      </button>
    </Link>
  );
}
