'use client';
import Link from 'next/link';

export default function CreateButton() {
  const removeGameFormData = () => {
    localStorage.removeItem('newGameForm');
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
