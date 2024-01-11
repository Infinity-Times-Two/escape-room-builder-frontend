import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';

interface CaesarCypherChallengeProps {
  currentChallenge: {
    id: string;
    type: string;
    description: string;
    clue: string | Array<string>;
    answer: string;
  };
  nextChallenge: number;
  currentGame: {
    id: string;
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

export default function CaesarCypherChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: CaesarCypherChallengeProps) {
  const [answer, setAnswer] = useState('');
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    return void 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.toLowerCase() === currentChallenge.answer.toLowerCase()) {
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
    <div className='flex flex-col items-center sm:p-16 min-h-screen gap-8'>
      <h1>
        {currentChallenge?.type}: {currentChallenge?.description}
      </h1>
      <h2>{currentChallenge?.clue}</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <Input
          type='text'
          placeholder='Your answer'
          onChange={handleChange}
          value={answer}
        />
        <button className='large' type='submit'>
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
}
