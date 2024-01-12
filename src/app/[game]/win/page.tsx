'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';
export default function Win() {
  const { expiry, finishTime } = useContext(TimerContext);

  let formattedTime: { minutes: string; seconds: string } = {
    minutes: '15',
    seconds: '0',
  };
  console.log('finish time:');
  console.log(finishTime);
  formattedTime = {
    minutes: ((expiry - finishTime) / 60 - 1).toFixed(),
    seconds: ((expiry - finishTime) % 60).toFixed(),
  };
  console.log('formatted time:');
  console.log(formattedTime);
  return (
    <div className='flex flex-col items-center justify-start py-16 min-h-screen gap-8'>
      <h1>You win!</h1>
      <h2>Game Stats:</h2>
      <div className='chip'>
        <span>
          Time remaining: {formattedTime.minutes + 'm ' + formattedTime.seconds + 's'}
        </span>
      </div>
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
