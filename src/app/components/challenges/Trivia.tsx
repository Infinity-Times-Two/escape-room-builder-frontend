import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { Game, Challenge } from '@/app/types/types';

interface TriviaChallengeProps {
  currentChallenge: Challenge;
  nextChallenge: number;
  currentGame: Game;
}

export default function TriviaChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: TriviaChallengeProps) {
  const [answer, setAnswer] = useState('');
  const [incorrect, setIncorrect] = useState<boolean>(false);
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
      setIncorrect(true);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <p className='text-center font-bold text-xl' data-type='challenge-submit'>{currentChallenge.clue}</p>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-8'
      >
        <Input
          fieldType='text'
          placeholder='Your answer'
          onChange={handleChange}
          value={answer}
        />
        <button className='large' type='submit' data-type='challenge-submit'>
          <span>Submit</span>
        </button>
      </form>
      {incorrect && <Modal setIncorrect={setIncorrect}>Incorrect!</Modal>}
    </div>
  );
}
