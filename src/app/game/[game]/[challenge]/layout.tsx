'use client';
import Timer from '@/app/components/ui/Timer';
import { useContext } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  
  const { expiry } = useContext(TimerContext);
  return (
    <>
      <Timer timeLeft={expiry} />
      {children}
    </>
  )
}