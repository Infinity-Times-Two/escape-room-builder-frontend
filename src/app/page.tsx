import Link from 'next/link';
export default function Home() {
  return (
    <div className='flex flex-col w-full justify-center'>
      <div className='flex flex-wrap justify-center gap-8'>
        <Link href='/play'>
          <button className='xl'>
            <span>Play</span>
          </button>
        </Link>
        <Link href='/new-game'>
          <button className='xl green'>
            <span>Create</span>
          </button>
        </Link>
      </div>
      <p></p>
    </div>
  );
}
