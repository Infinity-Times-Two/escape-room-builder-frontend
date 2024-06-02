'use client';
import Timer from '@/app/components/ui/Timer';
import { useContext } from 'react';
import { TimerContext } from '@/app/contexts/timerContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  
  const { expiry } = useContext(TimerContext);
  const { singleGame } = useContext(SingleGameContext)
  return (
    <>
      {singleGame.timeLimit > 0 && <Timer timeLeft={expiry} />}
      {children}
    </>
  )
}