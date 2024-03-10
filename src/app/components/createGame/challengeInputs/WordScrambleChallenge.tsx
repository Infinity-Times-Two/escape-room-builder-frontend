import Input from '../../ui/Input';
import { useState } from 'react';
import Card from '../../ui/Card';

export default function WordScrambleChallenge({
  index,
  clue,
  description,
  answer,
  onClueChange,
  onDescriptionChange,
  onAnswerChange,
  challengeType,
}: {
  index: number;
  clue: string | string[] | undefined;
  description: string | undefined;
  answer: string | undefined;
  onClueChange(e: any, index: number | undefined): void;
  onDescriptionChange(e: any, index: number | undefined): void;
  onAnswerChange(e: any, index: number | undefined): void;
  challengeType: string;
}) {
  const [words, setWords] = useState<string[]>([]);

  const shuffleWords = (array: string[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffle = (e: any) => {
    e.preventDefault();
    if (answer !== undefined) {
      clue = shuffleWords(answer.split(' '));
      setWords(clue);
      onClueChange(clue, index);
    }
  };

  return (
    <div key={`${challengeType}-${index}`}>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-description-${index}`} className=''>
        Description
      </label>
      <Input
        fieldType={`challenge-description-${index}`}
        value={description}
        placeholder={`${challengeType} description`}
        onChange={onDescriptionChange}
        key={`challenge-description-${index}`}
      />
      <label htmlFor={`challenge-answer-${index}`}>Answer</label>
      <Input
        fieldType={`challenge-answer-${index}`}
        value={answer}
        placeholder={`${challengeType} answer`}
        onChange={onAnswerChange}
        key={`challenge-answer-${index}`}
      />
      <div className='flex flex-row flex-wrap'>
        <button onClick={shuffle}>
          <span>Scramble</span>
        </button>
        <Card>
          <div className='flex flex-row gap-2 flex-wrap justify-center'>
            {words.map((word: string, index: number) => (
              <div key={index} className='badge orange'>
                <span>{word}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
