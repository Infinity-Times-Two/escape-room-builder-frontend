import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { Game, Challenge } from '@/app/types/types';

interface WordScrambleChallengeProps {
  currentChallenge: Challenge;
  nextChallenge: number;
  currentGame: Game;
}

export default function WordScrambleChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: WordScrambleChallengeProps) {
  const [answer, setAnswer] = useState<string[]>([]);
  const [incorrect, setIncorrect] = useState<boolean>(false);

  const [clues, setClues] = useState<
    { clue: string; active: boolean; index: number }[]
  >(
    Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((clue, index) => ({
          clue,
          active: true,
          index,
        }))
      : [{ clue: currentChallenge.clue, active: true, index: 0 }]
  );

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      answer.join(' ').toLowerCase() === currentChallenge.answer.toLowerCase()
    ) {
      if (nextChallenge === currentGame.challenges.length) {
        router.push(`../${currentGame.id}/win`);
      } else {
        router.push(`./${currentGame.challenges[nextChallenge].id}`);
      }
    } else {
      setIncorrect(true);
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center max-w-full'>
      <Card>
        <p className='text-sm mb-2'>Clues:</p>
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {Array.isArray(currentChallenge.clue) &&
            clues.map(
              (clue: { clue: string; active: boolean }, index: number) => (
                <div
                  key={index}
                  className={`badge orange ${
                    clue.active ? 'visible' : 'invisible'
                  }`}
                  onClick={() => {
                    setAnswer([...answer, clue.clue]);
                    setClues(
                      clues.map((item) =>
                        item.index === index ? { ...item, active: false } : item
                      )
                    );
                    // This toggles CSS visibility rather than removing them from state or the DOM
                    // to prevent the container from resizing and keep the clues in the same order
                  }}
                >
                  <span>{clue.clue}</span>
                </div>
              )
            )}
        </div>
      </Card>
      <Card>
        <p className='text-sm mb-2'>Your answer:</p>
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {answer &&
            answer.map((word: string, answerIndex: number) => (
              <div
                key={answerIndex}
                className='badge blue'
                onClick={() => {
                  const firstInactiveIndex = clues.findIndex(
                    (item) => item.clue === word && !item.active
                  );
                  if (firstInactiveIndex !== -1) {
                    setClues(
                      clues.map((item, index) =>
                        index === firstInactiveIndex
                          ? { ...item, active: true }
                          : item
                      )
                    );
                  }
                  setAnswer(answer.filter((_, index) => index !== answerIndex));
                }}
              >
                <span>{word}</span>
              </div>
            ))}
        </div>
      </Card>
      <button
        className='large'
        onClick={handleSubmit}
        data-type='challenge-submit'
      >
        <span>Submit</span>
      </button>
      {incorrect && <Modal setIncorrect={setIncorrect}>Incorrect!</Modal>}
    </div>
  );
}
