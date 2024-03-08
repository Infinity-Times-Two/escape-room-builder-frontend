import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import { SingleGame, Challenge } from '@/app/types/types';

interface WordScrambleChallengeProps {
  currentChallenge: Challenge;
  nextChallenge: number;
  currentGame: SingleGame;
}

export default function WordScrambleChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: WordScrambleChallengeProps) {
  const [answer, setAnswer] = useState<string[]>([]);

  const [clues, setClues] = useState<{ clue: string; active: boolean }[]>(
    Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((clue) => ({ clue, active: true }))
      : [{ clue: currentChallenge.clue, active: true }]
  );

  const shuffleClues = (array: { clue: string; active: boolean }[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const newClues = shuffleClues(clues);
    setClues(newClues);
    // including clues in the dependency array causes an infinite loop, so:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      answer.join(' ').toLowerCase() === currentChallenge.answer.toLowerCase()
    ) {
      if (nextChallenge === currentGame.challenges?.length) {
        router.push(`../${currentGame.id}/win`);
      } else {
        router.push(`./${currentGame.challenges?.[nextChallenge].id}`);
      }
    } else {
      alert('incorrect');
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center max-w-full'>
      <Card>
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
                        item.clue === clue.clue
                          ? { ...item, active: !item.active }
                          : item
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
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {answer &&
            answer.map((word: string, index: number) => (
              <div
                key={index}
                className='badge blue'
                onClick={() => {
                  setClues(
                    clues.map((item) =>
                      item.clue === word
                        ? { ...item, active: !item.active }
                        : item
                    )
                  );
                  setAnswer(answer.filter((item) => item !== word));
                }}
              >
                <span>{word}</span>
              </div>
            ))}
        </div>
      </Card>
      <button className='large' onClick={handleSubmit}>
        <span>Submit</span>
      </button>
    </div>
  );
}
