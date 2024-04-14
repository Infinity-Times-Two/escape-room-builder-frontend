'use client';
import { useContext, useEffect, useState } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';
import { useRouter } from 'next/navigation';

export default function Timer(props: { timeLeft: number }) {
  // Adapted from https://www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks
  const calculateTimeLeft = (expiry: number) => {
    const now = Date.now();
    const difference = (expiry - now) / 1000;
    return difference;
  };

  const { expiry, finishTime, setFinishTime } = useContext(TimerContext);
  const [timeRemaining, setTimeRemaining] = useState(props.timeLeft);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (expiry) {
        setTimeRemaining(calculateTimeLeft(expiry));
        setFinishTime(props.timeLeft - timeRemaining);
      }
    }, 1000);
    const now = Date.now();
    if (timeRemaining <= 0) {
      router.push('/lose');
    }
    console.table({'Time remaining: ': timeRemaining, 'Expiry': expiry, 'Finish time: ': finishTime})
    return () => clearTimeout(timer);
  });

  let formattedTime: { minutes: string; seconds: string } = {
    minutes: '15',
    seconds: '0',
  };

  if (typeof timeRemaining === 'number') {
    if (timeRemaining > 0) {
      formattedTime = {
        minutes: Math.floor(timeRemaining / 60).toFixed(),
        seconds: (timeRemaining % 60).toFixed(),
      };
    }
  }
  // Note - this will be positioned relative to <main>, the nearest relatively positioned element
  return (
    <div className='flex justify-center m-6 absolute right-0 top-0 min-w-[300px]'>
      <div className='flex flex-row nowrap justify-between items-center gap-2 block rounded-full bg-white min-w-[250px] text-black text-xl font-semibold border-2 border-black py-1.5 px-8 tracking-wider'>
        <span>
          {/* Only render time left after first calculation */}
          Time left:
        </span>{' '}
        <span className='countdown'>
          <span style={{ '--value': formattedTime.minutes } as React.CSSProperties}></span>:
          <span style={{ '--value': formattedTime.seconds } as React.CSSProperties}></span>
        </span>
      </div>
    </div>
  );
}
