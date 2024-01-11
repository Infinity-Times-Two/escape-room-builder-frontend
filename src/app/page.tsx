import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center py-16 gap-4'>
      <div className='flex flex-col w-full justify-center'>
        <div className='flex flex-wrap justify-center gap-8'>
          <Link href='/play'><button className='xl'><span>Play</span></button></Link>
          <button className='xl green'><span>Create</span></button>
        </div>
      </div>
    </main>
  );
}
