import Input from '../../ui/Input';
import { useState, forwardRef, useEffect } from 'react';
import FlipMove from 'react-flip-move';
import Card from '../../ui/Card';

export default function WordScrambleChallenge({
  index,
  clue,
  description,
  answer,
  onClueChange,
  onDescriptionChange,
  onAnswerChange,
  onRemove,
  challengeType,
}: {
  index: number;
  clue: string | string[] | undefined;
  description: string | undefined;
  answer: string | undefined;
  onClueChange(e: any, index: number | undefined): void;
  onDescriptionChange(e: any, index: number | undefined): void;
  onAnswerChange(e: any, index: number | undefined): void;
  onRemove(e: any): void;
  challengeType: string;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // TO DO: Shuffle again if the new clue is the same as the previous clue
  const shuffleWords = (array: string[]) => {
    let newArray = [...array];
    while (
      // keep shuffling if the clue array is the same as the answer
      newArray.length === array.length &&
      newArray.every((element, index) => element === array[index])
    ) {
      for (let i = newArray.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }
    return newArray;
  };

  const shuffle = (e: any) => {
    e.preventDefault();
    if (answer !== undefined) {
      clue = answer.trim().split(' ');
      if (clue.length > 2) {
        setError(false);
        const shuffledClue = shuffleWords(clue);
        setWords(shuffledClue);
        onClueChange(shuffledClue, index);
      } else {
        setErrorMessage('Please enter at least 3 words');
        setError(true);
      }
    }
  };

  useEffect(() => {
    setError(false);
  }, [answer]);

  type Props = {
    word: string;
  };

  const Badge = forwardRef<HTMLLIElement, Props>(({ word }, ref) => (
    <li ref={ref}>
      <div className='badge orange'>
        <span>{word}</span>
      </div>
    </li>
  ));

  Badge.displayName = 'Badge';

  return (
    <div
      key={`${challengeType}-${index}`}
      className='flex flex-col gap-8 border-2 border-black p-8 rounded-xl bg-white/50 relative'
      id={`${challengeType}-${index}`}
    >
      <p className='absolute top-0 left-0 p-6 text-2xl'>{index + 1}</p>
      <button
        onClick={onRemove}
        className='btn btn-circle btn-outline absolute top-0 right-0'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <div>
        <label htmlFor={`challenge-description-${index}`}>
          Description (optional)
        </label>
        <Input
          fieldType={`challenge-description-${index}`}
          value={description}
          placeholder='Describe the phrase to be solved'
          onChange={onDescriptionChange}
          key={`challenge-description-${index}`}
        />
      </div>
      <div>
        <label htmlFor={`challenge-answer-${index}`}>Answer</label>
        <Input
          fieldType={`challenge-answer-${index}`}
          value={answer}
          placeholder=''
          onChange={onAnswerChange}
          key={`challenge-answer-${index}`}
        />
      </div>
      <div className='flex flex-row'>
        <button onClick={shuffle}>
          <span>Scramble</span>
        </button>
        {error && (
          <div role='alert' className='alert alert-warning mx-4 self-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
      <Card>
        <div className='flex flex-row gap-2 flex0wrap justify-center'>
          <FlipMove
            staggerDurationBy='50'
            duration={600}
            typeName='ul'
            className='flex flex-row flex-wrap justify-center'
          >
            {words.map((word: string, index: number) => (
              <Badge key={`${word}-${index}`} word={word} />
            ))}
          </FlipMove>
        </div>
      </Card>
    </div>
  );
}
