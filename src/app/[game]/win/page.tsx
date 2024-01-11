import Link from 'next/link';

export default function Win() {
  return (
    <div className='flex flex-col items-center justify-start py-16 min-h-screen gap-8'>
      <h1>You win!</h1>
      <h2>Game Stats:</h2>
      <div className='chip'>
        <span>Time: 12:34</span>
      </div>
      <p>(not a real time)</p>
      <div className='flex flex-row'>
        <div className='badge orange'>
          <span>Speedy</span>
        </div>
        <div className='badge blue'>
          <span>Clever</span>
        </div>
      </div>
      <Link href='/play'>
        <button className='xl green'>
          <span>Play again</span>
        </button>
      </Link>
    </div>
  );
}
