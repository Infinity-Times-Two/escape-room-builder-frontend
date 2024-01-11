import Link from 'next/link';

export default function Header() {
  return (
    <header className='grid grid-cols-1 sm:grid-cols-2 items-center px-16'>
      <h1 className='text-xl sm:text-2xl justify-self-center sm:justify-self-start py-6'>
        <Link href='/'>Escape Room Builder</Link>
      </h1>
      <div className='justify-self-center sm:justify-self-end space-x-16 py-2 sm:py-6'>
        <Link href='/about'>About</Link>
        <button className='small'>
          <span>Sign up</span>
        </button>
      </div>
    </header>
  );
}
