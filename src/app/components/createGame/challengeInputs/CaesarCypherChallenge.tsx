import Input from '../../ui/Input';
import { useState, useEffect } from 'react';
import RemoveButton from '../../ui/RemoveButton';

export const encrypt = (answer: string | undefined, seed: number) => {
  let originalWord: string[];
  let encryptedWord: string[] = [];

  if (typeof answer === 'string') {
    const lowerCaseAnswer = answer.toLowerCase();
    originalWord = Array.from(lowerCaseAnswer);
    originalWord.forEach((letter) => {
      let newLetter = letter.charCodeAt(0);
      if (newLetter !== 32) {
        newLetter = letter.charCodeAt(0) + seed;
      }
      if (newLetter > 122) {
        newLetter = newLetter - 26;
      }
      encryptedWord.push(String.fromCharCode(newLetter));
    });
  }
  return encryptedWord.toString().toLowerCase().replaceAll(',', '');
};

export default function CaesarCypherChallenge({
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
}) {
  const [encryptedClue, setEncryptedClue] = useState<string>('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [seed, setSeed] = useState('');

  useEffect(() => {
    if (typeof answer !== 'undefined' && answer !== '') {
      let regex = /^[A-Za-z ]+$/;
      setErrorMessage('Please only use letters and spaces');
      setError(!regex.test(answer));
    }
  }, [answer]);

  const onEncrypt = (e: any) => {
    e.preventDefault();
    setEncryptedClue('');
    const randomSeed = Math.floor(Math.random() * 25) + 1;
    setSeed(String.fromCharCode(97 + randomSeed).toUpperCase());
    // let regex = /^[A-Za-z]+$/;
    if (typeof answer === 'string' && answer.length < 3) {
      setError(true);
      setErrorMessage('Please enter at least one word');
      return;
    }
    setError(false);
    clue = encrypt(answer, randomSeed);
    onClueChange(clue, index);
    setEncryptedClue(clue.toString());
  };

  const handleKeyDown = (e: any) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      onEncrypt(e);
    }
  };

  // Clear encrypted word when form is reset
  useEffect(() => {
    if (clue?.length === 0) {
      setEncryptedClue('');
    }
  }, [clue]);

  return (
    <div
      className='border-2 border-black p-8 rounded-xl bg-white/50 relative'
      key={`${challengeType}-${index}`}
      id={`${challengeType}-${index}`}
      data-testid={`${challengeType.replaceAll(" ", "-")}-${index}`} // this needs to be refactored to just include a hypen (word scramble, too)
    >
      <p className='absolute top-0 left-0 p-6 text-2xl'>{index + 1}</p>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-description-${index}`} className=''>
        Describe the word to be decrypted
      </label>
      <Input
        fieldType={`challenge-description-${index}`}
        value={description}
        placeholder='Describe the word to be decrypted'
        onChange={onDescriptionChange}
        key={`challenge-description-${index}`}
      />
      <label htmlFor={`challenge-answer-${index}`}>Answer</label>
      <Input
        fieldType={`challenge-answer-${index}`}
        value={answer}
        placeholder='Answer'
        onChange={onAnswerChange}
        key={`challenge-answer-${index}`}
        dataTest={`${dataTest}-answer`}
      />
      <div className='flex flex-row'>
        <button
          role='encrypt'
          onClick={onEncrypt}
          disabled={error}
          data-test={`${index}-encrypt-button`}
        >
          <span>Encrypt</span>
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
        {encryptedClue && (
          <div role='alert' className='alert alert-info mx-4 self-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='stroke-current shrink-0 w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span>{`Key: A ➜ ${seed}`}</span>
          </div>
        )}
      </div>
      <label htmlFor={`challenge-caesar-cypher-clue-${index}`}>
        Encrypted clue:
      </label>
      <Input
        fieldType={`challenge-caesar-cypher-clue-${index}`}
        value={encryptedClue.toString().replaceAll(',', '')}
        onChange={onClueChange}
        placeholder=''
        onKeyDown={handleKeyDown}
        key={`challenge-caesar-cypher-clue-${index}`}
        disabled
        dataTest={`${dataTest}-clue`}
      />
      <RemoveButton onRemove={onRemove} testId={`remove-caesar-cypher-${index}`}/>
    </div>
  );
}
