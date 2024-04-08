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
  const [incorrectWords, setIncorrectWords] = useState<string[]>([]);
  const [submitAnswer, setSubmitAnswer] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const punctuationRegex = /^[,.!?]$/;

  useEffect(() => {
    setError(false);
    let newWords: string[];
    if (typeof answer !== 'undefined' && answer !== '') {
      // Separate out words and punctuation
      const punctuation = /[\w']+|[.,!?;]/g;
      let matches = answer?.match(punctuation);
      newWords = matches ? matches : [];
      setWords(newWords);
      // If words have been selected to be removed, this will "reset" them
      // TODO: Figure out how to allow the user to continue typing wihout losing "removed" words
    }
  }, [answer]);

  useEffect(() => {
    const newClue = [...words, ...incorrectWords];
    console.log(words);
    onClueChange(newClue, index);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, incorrectWords]);

  const markWord = (word: string, index: number) => {
    if (word.match(punctuationRegex)) {
      return;
    }
    if (words[index].startsWith('~')) {
      const updatedWord = word.substring(1);
      const updatedWords = [...words];
      updatedWords[index] = updatedWord;
      setWords(updatedWords);
      return;
    }
    const updatedWord = '~' + word;
    const updatedWords = [...words];
    updatedWords[index] = updatedWord;
    setWords(updatedWords);
  };

  const handleIncorrectWords = (e: any) => {
    // Remove extra spaces between words, start and end
    const value = e.target.value.replace(/^\s+|\s+$/g, '');
    let newWords: string[] = [];
    if (typeof value !== 'undefined') {
      newWords = value.split(', ');
    }
    // Extra spaces still create a string with just ~, so filtering for now
    newWords = newWords
      .map((word) => (word = '~' + word))
      .filter((word) => word !== '~');
    setIncorrectWords([...newWords]);
  };

  type Props = {
    word: string;
    onClick?: () => void;
  };

  const Badge = forwardRef<HTMLLIElement, Props>(({ word, onClick }, ref) => (
    <div className='badge blue inline' onClick={onClick}>
      <span>{word}</span>
    </div>
  ));

  Badge.displayName = 'Badge';

  // Clear answer when form is reset
  useEffect(() => {
    if (clue?.length === 1 && clue[0].length === 0) {
      setWords([]);
      setIncorrectWords([])
    }
  }, [clue]);

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
      <div>
        <label htmlFor={`challenge-answer-${index}`}>
          Incorrect words (comma separated, required)
        </label>
        <Input
          fieldType={`challenge-incorrect-words-${index}`}
          // value={incorrectWords}
          // Uncontrolled form input because the value becomes a stringified array
          // TO DO: Figure out how to make it controlled so words can be removed on click.
          placeholder='Add some incorrect words*'
          onChange={handleIncorrectWords}
          key={`challenge-incorrect-words-${index}`}
          dataTest={`${dataTest}-incorrect-words`}
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
      <Card>
        <div
          className={`flex flex-col gap-2 flex-wrap justify-center min-h-[100px] w-full ${
            submitError && words.length === 0 && 'bg-red-100'
          }`}
          data-test={`${dataTest}-clue`}
        >
          <div className='flex flex-col gap-8'>
            <div className='flex flex-row flex-wrap justify-center items-center list-none'>
              {words.map((word: string, index: number) =>
                word.startsWith('~') ? (
                  <span className='mb-2 px-1' key={`${word}-${index}`}>
                    ________
                  </span>
                ) : (
                  <span
                    className={`text-xl inline-block mb-2 rounded-lg ${
                      punctuationRegex.test(word)
                        ? `pr-1 -ml-0.5`
                        : `px-[3px] hover:bg-green-100 cursor-pointer`
                    }`}
                    onClick={() => markWord(word, index)}
                    key={`${word}-${index}`}
                    data-test={`${dataTest}-highlight-word-${index}`}
                  >
                    {word}
                  </span>
                )
              )}
            </div>
            <div
              data-test={`${dataTest}-FITB-clue-words`}
              className='flex flex-row flex-wrap justify-center items-center list-none gap-x-1.5'
            >
              {words.map(
                (word: string, index: number) =>
                  word.startsWith('~') && (
                    <Badge
                      key={`${word}-${index}`}
                      word={word.substring(1)}
                      onClick={() => markWord(word, index)}
                    />
                  )
              )}
              {incorrectWords.map((word: string, index: number) => (
                <Badge key={`${word}-${index}`} word={word.substring(1)} />
              ))}
            </div>
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
