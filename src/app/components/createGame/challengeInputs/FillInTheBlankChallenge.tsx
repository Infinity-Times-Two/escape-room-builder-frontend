import Input from '../../ui/Input';
import { useState, forwardRef, useEffect } from 'react';
import Card from '../../ui/Card';
import RemoveButton from '../../ui/RemoveButton';

export default function FillInTheBlankChallenge({
  index,
  clue,
  description,
  answer,
  onClueChange,
  onDescriptionChange,
  onAnswerChange,
  onRemove,
  challengeType,
  dataTest,
  submitError,
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
  dataTest: string;
  submitError: boolean;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [wordsWithBlanks, setWordsWithBlanks] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(false);
    let newWords: string[] = [];
    if (typeof answer !== 'undefined') {
      newWords = answer.split(' ');
    }
    setWords(newWords);
  }, [answer]);

  useEffect(() => {
    onClueChange(words, index);
  }, [words]);

  // Clear scrambled words when form is reset
  // useEffect(() => {
  //   if (clue?.length === 1 && clue[0].length === 0) {
  //     setWords([]);
  //   }
  // }, [clue]);

  const markWord = (word: string, index: number) => {
    const updatedWord = '~' + word;
    const updatedWords = [...wordsWithBlanks];
    updatedWords[index] = updatedWord;
    setWordsWithBlanks(updatedWords);
  };

  type Props = {
    word: string;
  };

  const Badge = forwardRef<HTMLLIElement, Props>(({ word }, ref) => (
    <div className='badge orange inline'>
      <span>{word}</span>
    </div>
  ));

  Badge.displayName = 'Badge';

  return (
    <div
      key={`${challengeType}-${index}`}
      className='flex flex-col gap-8 border-2 border-black p-8 rounded-xl bg-white/50 relative'
      id={`${challengeType}-${index}`}
      data-testid={`${challengeType}-${index}`}
    >
      <p className='absolute top-0 left-0 p-6 text-2xl'>{index + 1}</p>
      <h3 className='mb-6'>
        New {challengeType.replaceAll('-', ' ')} Challenge
      </h3>
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
        <label htmlFor={`challenge-answer-${index}`}>Answer (required)</label>
        <Input
          fieldType={`challenge-answer-${index}`}
          value={answer}
          placeholder='Answer*'
          onChange={onAnswerChange}
          key={`challenge-answer-${index}`}
          dataTest={`${dataTest}-answer`}
          submitError={submitError}
          required
        />
      </div>
      <div className='flex flex-row'>
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
      <Card maxWidth='max-w-[800px]'>
        <div
          className={`flex flex-col gap-2 flex-wrap justify-center h-[100px] w-full ${
            submitError && words.length === 0 && 'bg-red-100'
          }`}
          data-test={`${dataTest}-clue`}
        >
          <div className='flex flex-row flex-wrap justify-center list-none gap-x-1.5'>
            {words.map((word: string, index: number) => (
              <span
                className={`text-xl`}
                onClick={() => markWord(word, index)}
                key={`${word}-${index}`}
              >
                {word}
              </span>
            ))}
          </div>
          
          <div className='flex flex-row flex-wrap justify-center list-none gap-x-1.5'>
            {wordsWithBlanks.map((word: string, index: number) => (
              <span
                className={`text-xl`}
                onClick={() => markWord(word, index)}
                key={`${word}-${index}`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </Card>
      <RemoveButton
        onRemove={onRemove}
        testId={`remove-word-scramble-${index}`}
      />
    </div>
  );
}
