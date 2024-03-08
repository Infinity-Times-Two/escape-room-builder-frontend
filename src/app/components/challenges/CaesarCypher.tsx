import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import { SingleGame } from '@/app/types/types';

interface CaesarCypherChallengeProps {
  currentChallenge: {
    id: string;
    type: string;
    description: string;
    clue: string | Array<string>;
    answer: string;
  };
  nextChallenge: number;
  currentGame: SingleGame;
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
    <div className='flex flex-col items-center gap-8'>
      <h2>{currentChallenge?.clue}</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <Input
          fieldType='text'
          placeholder='Your answer'
          onChange={handleChange}
          value={answer}
        />
        <button className='large self-center' type='submit'>
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
}
