import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from 'react';
import { useContext, useEffect, useState } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';

export default function Timer(props: { timeLeft: number }) {
  // Adapted from https://www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks
  const calculateTimeLeft = (expiry: number) => {
    const now = Date.now();
    const difference = (expiry - now) / 1000;
    return difference;
  };

  const { expiry } = useContext(TimerContext);
  const [timeRemaining, setTimeRemaining] = useState(props.timeLeft);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (expiry) {
        setTimeRemaining(calculateTimeLeft(expiry));
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  let formattedTime: { minutes: string; seconds: string } = {
    minutes: '0',
    seconds: '0',
  };
  if (typeof timeRemaining === 'number') {
    if (timeRemaining > 0) {
      formattedTime = {
        minutes: (timeRemaining / 60).toFixed(),
        seconds: (timeRemaining % 60).toFixed(),
      };
    }
  }

  console.log(formattedTime);

  return (
    <div className='m-6 absolute right-0 min-w-[250px]'>
      <div className='block rounded-full bg-white min-w-[230px] text-black text-xl font-semibold border-2 border-black py-1.5 px-8 tracking-wider'>
        <span>
          Time left: {formattedTime.minutes}m {formattedTime.seconds}s
        </span>
      </div>
    </div>
  );
}
