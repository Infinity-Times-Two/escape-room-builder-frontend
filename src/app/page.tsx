import Link from 'next/link';
import CreateButton from './components/ui/CreateButton';

export default function Home() {
  return (
    <div className='flex flex-col w-full justify-center'>
      <div className='flex flex-wrap justify-center gap-8'>
        <Link href='/play'>
          <button data-test='play' className='xl'>
            <span>Play</span>
          </button>
        </Link>
        <CreateButton />
      </div>
      <p></p>
    </div>
  );
}
