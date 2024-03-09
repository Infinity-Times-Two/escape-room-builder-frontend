import Link from 'next/link';
export default function Home() {
  return (
    <div className='flex flex-col w-full justify-center'>
      <div className='flex flex-wrap justify-center gap-8'>
        <Link href='/play'>
          <button data-test='play' className='xl'>
            <span>Play</span>
          </button>
        </Link>
        <Link href='/new-game'>
          <button data-test='create' className='xl green'>
            <span>Create</span>
          </button>
        </Link>
      </div>
      <p></p>
    </div>
  );
}
