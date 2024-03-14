import Input from '../../ui/Input';
import { useState } from 'react';

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
  const encryptCaesarCypher = (answer: string | undefined) => {
    // leetcode mode ON
    let originalWord: string[];
    let encryptedWord: string[] = [];

    if (typeof answer === 'string') {
      originalWord = Array.from(answer);
      const randomSeed = Math.floor(Math.random() * 25) + 1;
      originalWord.forEach((letter) => {
        let newLetter = letter.charCodeAt(0) + randomSeed;
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
    clue = encryptCaesarCypher(answer).toString().replaceAll(',', '');
    onClueChange(clue, index);
  };

  return (
    <div
      className='border-2 border-black p-8 rounded-xl bg-white/50 relative'
      key={`${challengeType}-${index}`}
      id={`${challengeType}-${index}`}
    >
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
      <button onClick={onEncrypt}>
        <span>Encrypt</span>
      </button>
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
