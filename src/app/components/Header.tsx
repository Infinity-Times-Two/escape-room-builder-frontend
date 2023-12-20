import Link from 'next/link';

export default function Header() {
  return (
    <header className='grid grid-cols-2 items-center py-6 px-16'>
      <h1 className='justify-self-start'>
        <Link href='/'>Escape Room Builder</Link>
      </h1>
      <div className='justify-self-end space-x-16'>
        <Link href='/about'>About</Link>
        <button className='small'>
          <span>Sign up</span>
        </button>
      </div>
    </header>
  );
}
