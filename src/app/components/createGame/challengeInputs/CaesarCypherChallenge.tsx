import Input from '../../ui/Input';
import { useState, useEffect } from 'react';

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
  const [encryptedClue, setEncryptedClue] = useState<string>('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (typeof answer !== 'undefined' && answer !== '') {
      let regex = /^[A-Za-z ]+$/;
      setErrorMessage('Please only use letters and spaces')
      setError(!regex.test(answer))
    }
  }, [answer]);

  const encryptCaesarCypher = (answer: string | undefined) => {
    // leetcode mode ON
    let originalWord: string[];
    let encryptedWord: string[] = [];

    if (typeof answer === 'string') {
      const lowerCaseAnswer = answer.toLowerCase();
      originalWord = Array.from(lowerCaseAnswer);
      const randomSeed = Math.floor(Math.random() * 25) + 1;
      originalWord.forEach((letter) => {
        let newLetter = letter.charCodeAt(0);
        if (newLetter !== 32) {
          newLetter = letter.charCodeAt(0) + randomSeed;
        }
        if (newLetter > 122) {
          newLetter = newLetter - 26;
        }
        encryptedWord.push(String.fromCharCode(newLetter));
        setEncryptedClue(encryptedWord.toString());
      });
    }
    return encryptedWord;
  };

  const onEncrypt = (e: any) => {
    e.preventDefault();
    let regex = /^[A-Za-z]+$/;
    if (typeof answer === 'string' && !regex.test(answer)) {
      setError(true);
      setErrorMessage('Please enter at least one word')
      return
    }
    setError(false)
    clue = encryptCaesarCypher(answer)
      .toString()
      .toLowerCase()
      .replaceAll(',', '');
    console.log(clue);
    onClueChange(clue, index);
  };

  return (
    <div
      className='border-2 border-black p-8 rounded-xl bg-white/50 relative'
      key={`${challengeType}-${index}`}
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
      />
      <div className='flex flex-row'>
        <button onClick={onEncrypt} disabled={error}>
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
      </div>
      <p>Encrypted clue:</p>
      <Input
        fieldType={`challenge-caesar-cypher-clue-${index}`}
        value={encryptedClue.toString().replaceAll(',', '')}
        onChange={onClueChange}
        placeholder=''
        key={`challenge-caesar-cypher-clue-${index}`}
        disabled
      />
    </div>
  );
}
