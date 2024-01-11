import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WordScrambleChallengeProps {
  currentChallenge: {
    id: string;
    type: string;
    description: string;
    clue: string | Array<string>;
    answer: string;
  };
  nextChallenge: number;
  currentGame: {
    id: number;
    gameTitle: string;
    gameDescription: string;
    challenges: Array<{
      id: string;
      type: string;
      description: string;
      clue: string | Array<string>;
      answer: string;
    }>;
  };
}

export default function WordScrambleChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: WordScrambleChallengeProps) {

  const [answer, setAnswer] = useState<string[]>([]);
  const [clues, setClues] = useState<string[]>(
    Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue
      : [currentChallenge.clue]
  );

  const shuffleClues = (array: string[]) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // including clues in the dependency array causes an infinite loop
  }, []);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(answer.join(' '));
    if (answer.join(' ').toLowerCase() === currentChallenge.answer.toLowerCase()) {
      if (nextChallenge === currentGame.challenges.length) {
        router.push(`../${currentGame.id}/win`);
      } else {
        router.push(`./${currentGame.challenges[nextChallenge].id}`);
      }
    } else {
      alert('incorrect');
    }
  };

  return (
    <div className='flex flex-col items-center p-16 min-h-screen gap-8'>
      <h1>
        {currentChallenge?.type}: {currentChallenge?.description}
      </h1>
      <div className='flex flex-row gap-2 flex-wrap'>
        {Array.isArray(currentChallenge.clue) &&
          clues.map((clue: string, index: number) => (
            <div
              key={index}
              className='badge orange'
              onClick={() => {
                setAnswer([...answer, clue]);
                setClues(clues.filter((item) => item !== clue));
              }}
            >
              <span>{clue}</span>
            </div>
          ))}
      </div>
      <div className='flex flex-row gap-2 flex-wrap'>
        {answer &&
          answer.map((word: string, index: number) => (
            <div
              key={index}
              className='badge blue'
              onClick={() => {
                setClues([...clues, word]);
                setAnswer(answer.filter((item) => item !== word));
              }}
            >
              <span>{word}</span>
            </div>
          ))}
      </div>
      <button className='large' onClick={handleSubmit}>
        <span>Submit</span>
      </button>
    </div>
  );
}
