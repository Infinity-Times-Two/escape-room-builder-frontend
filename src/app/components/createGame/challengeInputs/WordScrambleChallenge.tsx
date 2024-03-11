import Input from '../../ui/Input';
import { useState, forwardRef } from 'react';
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

  // TO DO: Shuffle again if the new clue is the same as the previous clue
  const shuffleWords = (array: string[]) => {
    let newArray = [...array];
    while (
      // keep shuffling if the clue array is the same as the answer
      newArray.length === array.length &&
      newArray.every((element, index) => element === array[index])
    ) {
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }
    return newArray;
  };

  const shuffle = (e: any) => {
    e.preventDefault();
    if (answer === '') {
      setWords([]);
      alert('You must enter something!')
    }
    if (answer !== undefined) {
      clue = shuffleWords(answer.split(' '));
      setWords(clue);
      onClueChange(clue, index);
    }
  };

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
    <div key={`${challengeType}-${index}`} className='flex flex-col gap-8'>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <div>
        <label htmlFor={`challenge-description-${index}`}>Description</label>
        <Input
          fieldType={`challenge-description-${index}`}
          value={description}
          placeholder={`${challengeType} description`}
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
      <div className='flex flex-row justify-center gap-x-8'>
        <button onClick={shuffle}>
          <span>Scramble</span>
        </button>
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
    </div>
  );
}
