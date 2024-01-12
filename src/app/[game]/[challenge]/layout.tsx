'use client';
import Timer from '@/app/components/layout/Timer';
import { useContext } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  
  const { expiry } = useContext(TimerContext);
  console.log(`expiry time: ${expiry}`);
  return (
    <>
      <Timer timeLeft={expiry} />
      {children}
    </>
  )
}